"use client";

import { useActionState, useEffect, useRef } from "react";
import { changeOwnPassword } from "../../actions/auth";
import type { FormState } from "../../actions/types";
import { FormAlert, StatefulForm, PasswordInput, SubmitButton } from "@/components/admin/ui";

export function ChangePasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(changeOwnPassword, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <StatefulForm formRef={ref} action={action} className="space-y-4 bg-white p-6">
      <h2 className="font-serif text-xl text-brown-900">Alterar senha</h2>
      <FormAlert state={state} />
      <div>
        <label htmlFor="current" className="field-label">Senha atual</label>
        <PasswordInput id="current" name="current" autoComplete="current-password" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Nova senha</label>
        <PasswordInput id="password" name="password" autoComplete="new-password" />
        <p className="mt-1 text-xs text-muted">Mínimo de 10 caracteres, com letras e números.</p>
      </div>
      <div>
        <label htmlFor="confirm" className="field-label">Confirme a nova senha</label>
        <PasswordInput id="confirm" name="confirm" autoComplete="new-password" />
      </div>
      <SubmitButton>Alterar senha</SubmitButton>
    </StatefulForm>
  );
}
