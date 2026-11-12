"use client";

import { useEffect, useRef, useState } from "react";
import { ghostClass } from "@/components/ui/GhostButton";

type CopyEmailButtonProps = {
  email: string;
  label: string;
  copied: string;
  failed: string;
};

type CopyState = "idle" | "copied" | "failed";

const RESET_MS = 2000;

/* Copia el correo al portapapeles. El resultado se anuncia en una región role="status";
   el icono pasa de "copiar" a "check" sin animación. */
export function CopyEmailButton({ email, label, copied, failed }: CopyEmailButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    if (timer.current) window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
      timer.current = window.setTimeout(() => setState("idle"), RESET_MS);
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={copy} className={`${ghostClass} justify-center`}>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 16 16"
          className="size-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {state === "copied" ? (
            <path d="M3 8.5l3 3 7-7" />
          ) : (
            <>
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
              <path d="M10.5 3.5v-.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.5" />
            </>
          )}
        </svg>
        {state === "copied" ? copied : label}
      </button>
      <p role="status" className={state === "failed" ? "max-w-[36ch] text-sm text-fg-muted" : "sr-only"}>
        {state === "copied" ? copied : state === "failed" ? failed : ""}
      </p>
    </div>
  );
}
