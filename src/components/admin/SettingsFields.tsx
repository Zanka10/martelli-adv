"use client";

import { FieldError } from "./ui";

type Common = { name: string; label: string; defaultValue: string; hint?: string; errors?: Record<string, string> };

export function TextField({ name, label, defaultValue, hint, errors, type = "text", placeholder }: Common & { type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="field" aria-invalid={errors?.[name] ? true : undefined} />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <FieldError errors={errors} name={name} />
    </div>
  );
}

export function TextArea({ name, label, defaultValue, hint, errors, rows = 4 }: Common & { rows?: number }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">{label}</label>
      <textarea id={name} name={name} defaultValue={defaultValue} rows={rows} className="field resize-y" aria-invalid={errors?.[name] ? true : undefined} />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <FieldError errors={errors} name={name} />
    </div>
  );
}

export function Section({ id, title, description, children }: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 bg-white p-6 sm:p-8">
      <h2 className="text-2xl text-brown-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}
