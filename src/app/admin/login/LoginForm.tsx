"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login } from "../actions/auth";
import type { FormState } from "../actions/types";
import { FormAlert, PasswordInput, StatefulForm, SubmitButton } from "@/components/admin/ui";

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action] = useActionState<FormState, FormData>(login, notice ? { ok: notice } : {});
  return (
    <StatefulForm action={action} className="space-y-5">
      <FormAlert state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label htmlFor="email" className="field-label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus className="field" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="field-label">Senha</label>
          <Link href="/admin/recuperar-senha" className="mb-1.5 text-xs font-semibold text-brown-700 hover:text-gold-dark">
            Esqueci minha senha
          </Link>
        </div>
        <PasswordInput id="password" name="password" autoComplete="current-password" />
      </div>
      <SubmitButton className="btn btn-dark w-full" pendingText="Entrando…">
        <LogIn className="h-4 w-4" /> Entrar
      </SubmitButton>
    </StatefulForm>
  );
}
