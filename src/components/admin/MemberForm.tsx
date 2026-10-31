"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { saveMember } from "@/app/admin/actions/content";
import type { FormState } from "@/app/admin/actions/types";
import { FieldError, FormAlert, StatefulForm, SubmitButton } from "./ui";
import { ImageField } from "./ImageField";

export type MemberFormValues = {
  id?: string;
  name: string;
  role: string;
  oab: string;
  oabVerified: boolean;
  bio: string;
  photo: string;
  order: number;
  published: boolean;
  areaIds: string[];
};

export function MemberForm({ member, areas }: { member: MemberFormValues; areas: { id: string; title: string }[] }) {
  const [state, action] = useActionState<FormState, FormData>(saveMember, {});
  const fe = state.fieldErrors;

  return (
    <StatefulForm action={action} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <input type="hidden" name="id" value={member.id ?? ""} />
      <div className="min-w-0 space-y-6">
        <FormAlert state={state} />
        <div className="space-y-5 bg-white p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="field-label">Nome completo *</label>
              <input id="name" name="name" defaultValue={member.name} required className="field" />
              <FieldError errors={fe} name="name" />
            </div>
            <div>
              <label htmlFor="role" className="field-label">Cargo ou função</label>
              <input id="role" name="role" defaultValue={member.role} placeholder="Ex.: Advogada, Sócio, Estagiário" className="field" />
            </div>
            <div>
              <label htmlFor="oab" className="field-label">Inscrição na OAB</label>
              <input id="oab" name="oab" defaultValue={member.oab} placeholder="Ex.: SP 123.456" className="field" />
              <FieldError errors={fe} name="oab" />
            </div>
          </div>
          <label className="flex items-start gap-3 border border-line bg-sand/50 p-3 text-sm">
            <input type="checkbox" name="oabVerified" defaultChecked={member.oabVerified} className="mt-0.5 h-4 w-4 accent-[var(--color-gold-dark)]" />
            <span>
              <strong className="text-brown-900">Inscrição conferida</strong> — o número da OAB foi validado e pode ser exibido no site.
              <span className="block text-xs text-muted">Enquanto desmarcado, o número fica salvo apenas no painel.</span>
            </span>
          </label>
          <div>
            <label htmlFor="bio" className="field-label">Biografia profissional</label>
            <textarea id="bio" name="bio" defaultValue={member.bio} rows={7} maxLength={3000} className="field resize-y" />
            <p className="mt-1 text-xs text-muted">Inclua apenas formações e experiências confirmadas.</p>
          </div>
        </div>
        {areas.length > 0 && (
          <fieldset className="bg-white p-6">
            <legend className="field-label float-left mb-3 w-full">Áreas de atuação</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {areas.map((a) => (
                <label key={a.id} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" name="areas" value={a.id} defaultChecked={member.areaIds.includes(a.id)} className="h-4 w-4 accent-[var(--color-gold-dark)]" />
                  {a.title}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-4 bg-white p-6">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={member.published} className="h-4 w-4 accent-[var(--color-gold-dark)]" />
            Publicado (visível no site)
          </label>
          <div>
            <label htmlFor="order" className="field-label">Ordem de exibição</label>
            <input id="order" name="order" type="number" min={0} defaultValue={member.order} className="field" />
          </div>
          <SubmitButton className="btn btn-dark w-full">
            <Save className="h-4 w-4" /> Salvar
          </SubmitButton>
        </div>
        <div className="bg-white p-6">
          <ImageField name="photo" label="Fotografia" defaultValue={member.photo} aspect="aspect-[4/5]" hint="Retrato vertical, idealmente 800 × 1000 px." />
          <FieldError errors={fe} name="photo" />
        </div>
      </aside>
    </StatefulForm>
  );
}
