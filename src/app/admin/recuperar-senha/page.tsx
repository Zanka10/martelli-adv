"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "../actions/auth";
import type { FormState } from "../actions/types";
import { FormAlert, SubmitButton } from "@/components/admin/ui";
import { Logo } from "@/components/site/Logo";

export default function ForgotPasswordPage() {
  const [state, action] = useActionState<FormState, FormData>(requestPasswordReset, {});
  return (
    <main className="texture-dark flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo name="Martelli Advogados e Associados" />
        </div>
        <div className="bg-white p-8 sm:p-10">
          <span className="gold-rule block" />
          <h1 className="mt-5 text-3xl text-brown-900">Recuperar senha</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">Informe o e-mail cadastrado. Enviaremos um link para você criar uma nova senha.</p>
          <form action={action} className="mt-8 space-y-5">
            <FormAlert state={state} />
            {!state.ok && (
              <>
                <div>
                  <label htmlFor="email" className="field-label">E-mail</label>
                  <input id="email" name="email" type="email" autoComplete="username" required autoFocus className="field" />
                </div>
                <SubmitButton className="btn btn-dark w-full" pendingText="Enviando…">Enviar link de recuperação</SubmitButton>
              </>
            )}
            <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm font-semibold text-brown-700 hover:text-gold-dark">
              <ArrowLeft className="h-4 w-4" /> Voltar ao login
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}
