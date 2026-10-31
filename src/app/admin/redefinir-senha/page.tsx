"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "../actions/auth";
import type { FormState } from "../actions/types";
import { FormAlert, PasswordInput, SubmitButton } from "@/components/admin/ui";
import { Logo } from "@/components/site/Logo";

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [state, action] = useActionState<FormState, FormData>(resetPassword, {});

  if (!token)
    return (
      <p className="text-sm text-muted">
        Link inválido. <Link href="/admin/recuperar-senha" className="font-semibold text-brown-700 underline">Solicite uma nova redefinição</Link>.
      </p>
    );

  return (
    <form action={action} className="space-y-5">
      <FormAlert state={state} />
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className="field-label">Nova senha</label>
        <PasswordInput id="password" name="password" autoComplete="new-password" />
        <p className="mt-1 text-xs text-muted">Mínimo de 10 caracteres, com letras e números.</p>
      </div>
      <div>
        <label htmlFor="confirm" className="field-label">Confirme a nova senha</label>
        <PasswordInput id="confirm" name="confirm" autoComplete="new-password" />
      </div>
      <SubmitButton className="btn btn-dark w-full">Redefinir senha</SubmitButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="texture-dark flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo name="Martelli Advogados e Associados" />
        </div>
        <div className="bg-white p-8 sm:p-10">
          <span className="gold-rule block" />
          <h1 className="mt-5 mb-8 text-3xl text-brown-900">Criar nova senha</h1>
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
