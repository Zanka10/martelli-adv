"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { KeyRound, UserPlus } from "lucide-react";
import { createUser, setUserPassword } from "../../actions/users";
import type { FormState } from "../../actions/types";
import { FormAlert, StatefulForm, PasswordInput, SubmitButton } from "@/components/admin/ui";

export function NewUserForm() {
  const [state, action] = useActionState<FormState, FormData>(createUser, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <StatefulForm formRef={ref} action={action} className="space-y-4 bg-white p-6">
      <h2 className="font-serif text-xl text-brown-900">Novo usuário</h2>
      <FormAlert state={state} />
      <div>
        <label htmlFor="u-name" className="field-label">Nome</label>
        <input id="u-name" name="name" required className="field" />
      </div>
      <div>
        <label htmlFor="u-email" className="field-label">E-mail</label>
        <input id="u-email" name="email" type="email" required autoComplete="off" className="field" />
      </div>
      <div>
        <label htmlFor="u-role" className="field-label">Permissão</label>
        <select id="u-role" name="role" className="field" defaultValue="EDITOR">
          <option value="EDITOR">Editor — conteúdo do site</option>
          <option value="ADMIN">Administrador — acesso total</option>
        </select>
      </div>
      <div>
        <label htmlFor="u-password" className="field-label">Senha inicial</label>
        <PasswordInput id="u-password" name="password" autoComplete="new-password" />
        <p className="mt-1 text-xs text-muted">Mínimo de 10 caracteres, com letras e números.</p>
      </div>
      <SubmitButton className="btn btn-dark w-full">
        <UserPlus className="h-4 w-4" /> Criar usuário
      </SubmitButton>
    </StatefulForm>
  );
}

export function ResetUserPassword({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<FormState, FormData>(setUserPassword, {});
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-brown-700 hover:text-gold-dark">
        <KeyRound className="h-3 w-3" /> Redefinir senha
      </button>
    );
  return (
    <StatefulForm action={action} className="mt-3 w-full space-y-2 border-t border-line pt-3">
      <FormAlert state={state} />
      {!state.ok && (
        <>
          <input type="hidden" name="id" value={id} />
          <label htmlFor={`pw-${id}`} className="field-label">Nova senha para {name}</label>
          <PasswordInput id={`pw-${id}`} name="password" autoComplete="new-password" />
          <div className="flex gap-2">
            <SubmitButton className="btn btn-dark !px-4 !py-2">Definir</SubmitButton>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-outline !px-4 !py-2">Cancelar</button>
          </div>
        </>
      )}
    </StatefulForm>
  );
}
