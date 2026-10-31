"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { StatefulForm } from "@/components/admin/ui";
import { sendContactMessage, type ContactState } from "@/app/(site)/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, {});
  const fe = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div role="status" className="flex flex-col items-center py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold" strokeWidth={1.3} />
        <h3 className="mt-5 text-3xl text-brown-900">Mensagem enviada</h3>
        <p className="mt-3 max-w-sm text-muted">Obrigado pelo contato. Nossa equipe retornará assim que possível.</p>
      </div>
    );
  }

  const err = (name: string) =>
    fe[name] ? (
      <p id={`c-${name}-erro`} className="field-error">
        {fe[name]}
      </p>
    ) : null;
  const a11y = (name: string) => ({ id: `c-${name}`, name, "aria-invalid": fe[name] ? true : undefined, "aria-describedby": fe[name] ? `c-${name}-erro` : undefined });

  return (
    <StatefulForm action={action} className="space-y-6">
      {state.error && (
        <p role="alert" className="border border-[#e3b3a5] bg-[#fbf0ec] p-3 text-sm text-[#7d2d18]">
          {state.error}
        </p>
      )}
      <div className="hidden" aria-hidden>
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <label htmlFor="c-name" className="field-label">Nome *</label>
        <input {...a11y("name")} autoComplete="name" required className="field" />
        {err("name")}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="field-label">E-mail</label>
          <input {...a11y("email")} type="email" autoComplete="email" className="field" />
          {err("email")}
        </div>
        <div>
          <label htmlFor="c-phone" className="field-label">Telefone</label>
          <input {...a11y("phone")} type="tel" autoComplete="tel" className="field" />
          {err("phone")}
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="field-label">Assunto</label>
        <input {...a11y("subject")} className="field" />
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">Mensagem *</label>
        <textarea {...a11y("message")} rows={5} maxLength={3000} required className="field resize-y" />
        {err("message")}
      </div>
      <div>
        <label className="flex items-start gap-3 text-sm text-ink/85">
          <input type="checkbox" {...a11y("privacy")} className="mt-1 h-4 w-4 accent-[var(--color-gold-dark)]" />
          <span>
            Li e estou de acordo com o{" "}
            <Link href="/politica-de-privacidade" target="_blank" className="font-semibold text-brown-700 underline decoration-gold underline-offset-2">
              aviso de privacidade
            </Link>
            . *
          </span>
        </label>
        {err("privacy")}
      </div>
      <button type="submit" disabled={pending} className="btn btn-dark w-full sm:w-auto">
        <Send className="h-4 w-4" /> {pending ? "Enviando…" : "Enviar mensagem"}
      </button>
    </StatefulForm>
  );
}
