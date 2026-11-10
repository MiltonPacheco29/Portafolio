"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState, type FormEvent, type Ref } from "react";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { ctaClass } from "@/components/ui/ContactButton";
import { ghostClass } from "@/components/ui/GhostButton";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { LocalImage } from "@/lib/server/images";
import { contactFormConfigured, formspreeEndpoint, turnstileKey } from "@/lib/config/publicConfig";
import { fillTemplate } from "@/lib/text";
import { useTheme } from "@/lib/hooks/useTheme";

type FormTexts = Dictionary["sections"]["contact"]["form"];
type ContactFormProps = {
  texts: FormTexts;
  locale: Locale;
  /** Imagen del estado de éxito (leída en el build), o null si aún falta el archivo. */
  successImage: LocalImage | null;
};

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field | "turnstile", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const FIELDS: Field[] = ["name", "email", "message"];
const MAX_NAME = 100;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const EMPTY: Values = { name: "", email: "", message: "" };

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function validate(values: Values, token: string | null, t: FormTexts["errors"]): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = t.nameRequired;
  if (!values.email.trim()) errors.email = t.emailRequired;
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = t.emailInvalid;
  const message = values.message.trim();
  if (!message) errors.message = t.messageRequired;
  else if (message.length < MIN_MESSAGE) errors.message = fillTemplate(t.messageShort, { min: MIN_MESSAGE });
  else if (message.length > MAX_MESSAGE) errors.message = fillTemplate(t.messageLong, { max: MAX_MESSAGE });
  if (!token) errors.turnstile = t.turnstile;
  return errors;
}

/**
 * Formulario de contacto sin backend propio: envía a Formspree por fetch.
 * - Validación en el cliente (noValidate): errores enlazados con aria-describedby,
 *   aria-invalid, resumen con role="alert" y foco en el primer campo con error.
 * - Antispam: honeypot _gotcha (Formspree descarta el envío si viene relleno) y
 *   Cloudflare Turnstile; Formspree verifica el token con la clave secreta guardada en su panel.
 */
export function ContactForm({ texts, locale, successImage }: ContactFormProps) {
  const id = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const theme = useTheme();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const turnstileErrorRef = useRef<HTMLParagraphElement>(null);
  const showForm = status !== "success";

  // Turnstile: se (re)renderiza con el tema y el idioma del sitio.
  useEffect(() => {
    const container = widgetRef.current;
    if (!scriptReady || !turnstileKey || !container || !window.turnstile || !showForm) return;
    const widget = window.turnstile.render(container, {
      sitekey: turnstileKey,
      theme: theme ?? "auto",
      language: locale,
      size: "flexible",
      callback: (newToken: string) => {
        setToken(newToken);
        setTurnstileFailed(false);
        setErrors((current) => ({ ...current, turnstile: undefined }));
      },
      "expired-callback": () => setToken(null),
      "error-callback": () => {
        setToken(null);
        setTurnstileFailed(true);
      },
    });
    widgetId.current = widget;
    return () => {
      window.turnstile?.remove(widget);
      widgetId.current = null;
    };
  }, [scriptReady, theme, locale, showForm]);

  // Al enviar con éxito, el foco va al título del mensaje de éxito (lo anuncian los lectores).
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  if (!contactFormConfigured || !formspreeEndpoint) {
    return <p className="text-fg-muted">{texts.notConfigured}</p>;
  }
  const endpoint = formspreeEndpoint;

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Tras el primer intento, los errores se actualizan mientras se corrige.
    if (attempted) setErrors(validate(next, token, texts.errors));
  };

  const resetTurnstile = () => {
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot relleno: es un bot. Se finge éxito sin enviar nada.
    if (String(data.get("_gotcha") ?? "").trim()) {
      setStatus("success");
      return;
    }

    const found = validate(values, token, texts.errors);
    setErrors(found);
    setAttempted(true);
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    if (found.turnstile) {
      turnstileErrorRef.current?.focus();
      return;
    }

    setStatus("submitting");
    data.set("cf-turnstile-response", token ?? "");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Formspree ${response.status}`);
      setValues(EMPTY);
      setAttempted(false);
      setErrors({});
      setStatus("success");
    } catch {
      // Los datos siguen en el formulario; el token de Turnstile es de un solo uso.
      setStatus("error");
      resetTurnstile();
    }
  };

  if (!showForm) {
    return (
      <div className="flex flex-col items-start gap-4">
        <h4 ref={successRef} tabIndex={-1} className="font-display text-2xl font-semibold text-primary outline-none">
          {texts.success.title}
        </h4>
        <p className="text-fg-muted">{texts.success.body}</p>
        <AvatarImage
          image={successImage}
          alt={texts.success.image.alt}
          pending={texts.success.image.pending}
          className="w-full max-w-56"
        />
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={ghostClass}
        >
          {texts.success.again}
        </button>
      </div>
    );
  }

  const fieldIds = (field: Field) => ({ input: `${id}-${field}`, error: `${id}-${field}-error` });
  const describedBy = (field: Field, extra?: string) =>
    [errors[field] ? fieldIds(field).error : null, extra].filter(Boolean).join(" ") || undefined;
  const inputClass = (field: Field) =>
    `w-full rounded-sm border bg-bg px-3 py-2 text-fg ${errors[field] ? "border-accent" : "border-border-strong"}`;
  const errorText = (field: Field | "turnstile", errorId: string, ref?: Ref<HTMLParagraphElement>) =>
    errors[field] ? (
      <p id={errorId} ref={ref} tabIndex={ref ? -1 : undefined} className="flex gap-1 text-sm text-accent outline-none">
        {/* Además del color, un icono y el texto indican el error. */}
        <span aria-hidden="true">⚠</span>
        {errors[field]}
      </p>
    ) : null;
  const errorCount = Object.values(errors).filter(Boolean).length;
  const countId = `${id}-message-count`;
  const submitting = status === "submitting";

  return (
    <>
      <Script
        src={TURNSTILE_SCRIPT}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setTurnstileFailed(true)}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5" aria-busy={submitting}>
        <div className="flex flex-col gap-1 text-sm text-fg-muted">
          <p>{texts.intro}</p>
          <p>{texts.privacy}</p>
        </div>

        {attempted && errorCount > 0 && (
          <p role="alert" className="flex gap-2 rounded-sm border border-accent p-3 text-sm text-fg">
            <span aria-hidden="true" className="text-accent">⚠</span>
            {texts.errors.summary}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor={fieldIds("name").input} className="font-mono text-sm text-fg">
            {texts.fields.name}
          </label>
          <input
            id={fieldIds("name").input}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={MAX_NAME}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            className={inputClass("name")}
          />
          {errorText("name", fieldIds("name").error)}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={fieldIds("email").input} className="font-mono text-sm text-fg">
            {texts.fields.email}
          </label>
          <input
            id={fieldIds("email").input}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={inputClass("email")}
          />
          {errorText("email", fieldIds("email").error)}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={fieldIds("message").input} className="font-mono text-sm text-fg">
            {texts.fields.message}
          </label>
          <textarea
            id={fieldIds("message").input}
            name="message"
            rows={6}
            maxLength={MAX_MESSAGE}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", countId)}
            className={`${inputClass("message")} resize-y`}
          />
          <p id={countId} className="font-mono text-xs text-fg-muted">
            {fillTemplate(texts.messageCount, { count: values.message.length, max: MAX_MESSAGE })}
          </p>
          {errorText("message", fieldIds("message").error)}
        </div>

        {/* Honeypot: invisible y fuera del orden de tabulación; las personas no lo ven ni lo rellenan. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            {texts.honeypot}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {/* Turnstile: alto reservado (65 px) para que el widget no desplace el formulario al cargar. */}
        <div className="flex flex-col gap-1">
          <div ref={widgetRef} aria-label={texts.turnstile} role="group" className="min-h-[65px]" />
          {turnstileFailed && <p className="text-sm text-accent">{texts.errors.turnstileFailed}</p>}
          {errorText("turnstile", `${id}-turnstile-error`, turnstileErrorRef)}
        </div>

        {status === "error" && (
          <div role="alert" className="flex flex-col gap-1 rounded-sm border border-accent p-3">
            <p className="font-semibold text-fg">{texts.failure.title}</p>
            <p className="text-sm text-fg-muted">{texts.failure.body}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            aria-disabled={submitting}
            className={`${ctaClass} gap-2 aria-disabled:cursor-wait aria-disabled:opacity-90`}
          >
            {submitting && (
              <span
                aria-hidden="true"
                className="size-4 rounded-full border-2 border-on-cta border-t-transparent motion-safe:animate-spin"
              />
            )}
            {submitting ? texts.sending : texts.submit}
          </button>
          {/* Anuncia el envío a lectores de pantalla. */}
          <p role="status" className="sr-only">
            {submitting ? texts.sending : ""}
          </p>
        </div>
      </form>
    </>
  );
}
