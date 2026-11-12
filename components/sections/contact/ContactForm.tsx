"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState, type FormEvent, type Ref } from "react";
import { ctaClass } from "@/components/ui/ContactButton";
import { ghostClass } from "@/components/ui/GhostButton";
import type { Dictionary } from "@/lib/i18n";
import { siteLang } from "@/lib/i18n/locales";
import { formspreeEndpoint, turnstileKey } from "@/lib/config/publicConfig";
import { fillTemplate } from "@/lib/text";
import { useTheme } from "@/lib/hooks/useTheme";

type FormTexts = Dictionary["sections"]["contact"]["form"];
type ContactFormProps = {
  texts: FormTexts;
};

type Field = "topic" | "name" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field | "turnstile", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const FIELDS: Field[] = ["topic", "name", "email", "message"];
const MAX_NAME = 100;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const EMPTY: Values = { topic: "", name: "", email: "", message: "" };

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
  if (!values.topic) errors.topic = t.topicRequired;
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

/* Envío sin backend: valida en el cliente y publica el FormData en Formspree, que reenvía
   el mensaje por correo (reply-to = campo email). Antispam: Turnstile en modo
   "interaction-only" (solo se ve si Cloudflare pide interacción) y el campo trampa _gotcha. */
export function ContactForm({ texts }: ContactFormProps) {
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

  useEffect(() => {
    const container = widgetRef.current;
    if (!scriptReady || !turnstileKey || !container || !window.turnstile || !showForm) return;
    const widget = window.turnstile.render(container, {
      sitekey: turnstileKey,
      theme: theme ?? "auto",
      language: siteLang,
      size: "flexible",
      appearance: "interaction-only",
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
  }, [scriptReady, theme, showForm]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  if (!formspreeEndpoint || !turnstileKey) {
    return <p className="text-fg-muted">{texts.notConfigured}</p>;
  }
  const endpoint = formspreeEndpoint;

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validate(next, token, texts.errors));
  };

  const resetTurnstile = () => {
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  const fieldIds = (field: Field) => ({ input: `${id}-${field}`, error: `${id}-${field}-error` });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const data = new FormData(event.currentTarget);

    if (String(data.get("_gotcha") ?? "").trim()) {
      setStatus("success");
      return;
    }

    const found = validate(values, token, texts.errors);
    setErrors(found);
    setAttempted(true);
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(fieldIds(firstInvalid).input)?.focus();
      return;
    }
    if (found.turnstile) {
      turnstileErrorRef.current?.focus();
      return;
    }

    const topicLabel = texts.topic.options.find((option) => option.value === values.topic)?.label ?? values.topic;
    data.set("_subject", fillTemplate(texts.subject, { topic: topicLabel, name: values.name.trim() }));
    data.set("cf-turnstile-response", token ?? "");

    setStatus("submitting");
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
      setStatus("error");
      resetTurnstile();
    }
  };

  if (!showForm) {
    return (
      <div className="flex flex-col items-start gap-4">
        <h4 ref={successRef} tabIndex={-1} className="font-display text-3xl font-black text-primary outline-none">
          {texts.success.title}
        </h4>
        <p className="max-w-prose text-fg-muted">{texts.success.body}</p>
        <button type="button" onClick={() => setStatus("idle")} className={ghostClass}>
          {texts.success.again}
        </button>
      </div>
    );
  }

  const describedBy = (field: Field, extra?: string) =>
    [errors[field] ? fieldIds(field).error : null, extra].filter(Boolean).join(" ") || undefined;
  const errorText = (field: Field | "turnstile", errorId: string, ref?: Ref<HTMLParagraphElement>) =>
    errors[field] ? (
      <p id={errorId} ref={ref} tabIndex={ref ? -1 : undefined} className="flex gap-1 text-sm text-accent outline-none">
        <span aria-hidden="true">⚠</span>
        {errors[field]}
      </p>
    ) : null;
  const errorCount = Object.values(errors).filter(Boolean).length;
  const countId = `${id}-message-count`;
  const privacyId = `${id}-privacy`;
  const submitting = status === "submitting";
  const labelClass = "font-mono text-sm text-fg-muted";

  return (
    <>
      <Script
        src={TURNSTILE_SCRIPT}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setTurnstileFailed(true)}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8" aria-busy={submitting}>
        <p className="text-sm text-fg-muted">{texts.intro}</p>

        {attempted && errorCount > 0 && (
          <p role="alert" className="flex gap-2 rounded-sm border border-accent p-3 text-sm text-fg">
            <span aria-hidden="true" className="text-accent">⚠</span>
            {texts.errors.summary}
          </p>
        )}

        <fieldset
          aria-describedby={describedBy("topic")}
          className="flex flex-col gap-3"
        >
          <legend className={`${labelClass} mb-3`}>{texts.topic.legend}</legend>
          <div className="flex flex-wrap gap-2">
            {texts.topic.options.map((option, i) => {
              const optionId = i === 0 ? fieldIds("topic").input : `${fieldIds("topic").input}-${i}`;
              return (
                <span key={option.value} className="relative">
                  <input
                    id={optionId}
                    type="radio"
                    name="tipo"
                    value={option.value}
                    checked={values.topic === option.value}
                    onChange={() => update("topic", option.value)}
                    className="sr-only"
                  />
                  <label htmlFor={optionId} className="topic-pill">
                    {option.label}
                  </label>
                </span>
              );
            })}
          </div>
          {errorText("topic", fieldIds("topic").error)}
        </fieldset>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor={fieldIds("name").input} className={labelClass}>
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
              className="form-line"
            />
            {errorText("name", fieldIds("name").error)}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={fieldIds("email").input} className={labelClass}>
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
              className="form-line"
            />
            {errorText("email", fieldIds("email").error)}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={fieldIds("message").input} className={labelClass}>
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
            className="form-line form-line--ruled resize-y"
          />
          <p id={countId} className="self-end font-mono text-xs text-fg-muted">
            {fillTemplate(texts.messageCount, { count: values.message.length, max: MAX_MESSAGE })}
          </p>
          {errorText("message", fieldIds("message").error)}
        </div>

        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            {texts.honeypot}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="-my-4 flex flex-col gap-1">
          <div ref={widgetRef} aria-label={texts.turnstile} role="group" />
          {turnstileFailed && <p className="text-sm text-accent">{texts.errors.turnstileFailed}</p>}
          {errorText("turnstile", `${id}-turnstile-error`, turnstileErrorRef)}
        </div>

        {status === "error" && (
          <div role="alert" className="flex flex-col gap-1 rounded-sm border border-accent p-3">
            <p className="font-semibold text-fg">{texts.failure.title}</p>
            <p className="text-sm text-fg-muted">{texts.failure.body}</p>
          </div>
        )}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <button
            type="submit"
            aria-disabled={submitting}
            aria-describedby={privacyId}
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
          <p id={privacyId} className="max-w-[36ch] text-sm text-fg-muted">
            {texts.privacy}
          </p>
          <p role="status" className="sr-only">
            {submitting ? texts.sending : ""}
          </p>
        </div>
      </form>
    </>
  );
}
