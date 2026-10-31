"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { createCategory } from "../../actions/posts";
import type { FormState } from "../../actions/types";
import { FormAlert, StatefulForm, SubmitButton } from "@/components/admin/ui";

export function NewCategoryForm() {
  const [state, action] = useActionState<FormState, FormData>(createCategory, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <StatefulForm formRef={ref} action={action} className="space-y-4 self-start bg-white p-6">
      <h2 className="font-serif text-xl text-brown-900">Nova categoria</h2>
      <FormAlert state={state} />
      <div>
        <label htmlFor="cat-name" className="field-label">Nome</label>
        <input id="cat-name" name="name" required maxLength={60} className="field" />
      </div>
      <SubmitButton className="btn btn-dark w-full">
        <Plus className="h-4 w-4" /> Adicionar
      </SubmitButton>
    </StatefulForm>
  );
}
