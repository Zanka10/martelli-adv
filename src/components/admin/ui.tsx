"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

const PendingContext = createContext(false);

/**
 * Formulário para ações com useActionState que preserva o que foi digitado quando o
 * servidor devolve erros de validação (o envio nativo do React limparia os campos).
 */
export function StatefulForm({
  action,
  children,
  className,
  formRef,
}: {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  className?: string;
  formRef?: React.Ref<HTMLFormElement>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <PendingContext.Provider value={pending}>
      <form
        ref={formRef}
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
          const formData = new FormData(e.currentTarget, submitter);
          startTransition(() => action(formData));
        }}
      >
        {children}
      </form>
    </PendingContext.Provider>
  );
}

export function SubmitButton({
  children,
  pendingText = "Salvando…",
  className = "btn btn-dark",
  name,
  value,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const status = useFormStatus();
  const pending = useContext(PendingContext) || status.pending;
  return (
    <button type="submit" disabled={pending} className={className} name={name} value={value}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormAlert({ state }: { state: { ok?: string; error?: string } }) {
  if (state.error)
    return (
      <p role="alert" className="flex items-start gap-2 border border-[#e3b3a5] bg-[#fbf0ec] px-4 py-3 text-sm text-[#7d2d18]">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p role="status" className="flex items-start gap-2 border border-[#b9d3b4] bg-[#eef6ec] px-4 py-3 text-sm text-[#2d5a26]">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {state.ok}
      </p>
    );
  return null;
}

export function PasswordInput({ id, name, autoComplete, required = true }: { id: string; name: string; autoComplete: string; required?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} name={name} type={show ? "text" : "password"} autoComplete={autoComplete} required={required} className="field !pr-12" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-muted hover:text-brown-900"
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={show}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Botão de envio que pede confirmação antes de executar a ação (ex.: exclusões). */
export function ConfirmSubmit({ message, children, className }: { message: string; children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

export function FieldError({ errors, name }: { errors?: Record<string, string>; name: string }) {
  return errors?.[name] ? <p className="field-error">{errors[name]}</p> : null;
}
