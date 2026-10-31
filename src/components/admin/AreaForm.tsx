"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { saveArea } from "@/app/admin/actions/content";
import type { FormState } from "@/app/admin/actions/types";
import { AREA_ICONS, AreaIcon } from "@/components/icons";
import { FieldError, FormAlert, StatefulForm, SubmitButton } from "./ui";
import { RichTextEditor } from "./RichTextEditor";
import { ImageField } from "./ImageField";

export type AreaFormValues = {
  id?: string;
  title: string;
  slug: string;
  icon: string;
  image: string;
  summary: string;
  description: string;
  situations: string;
  complementary: string;
  order: number;
  active: boolean;
  showInQuoteForm: boolean;
};

export function AreaForm({ area }: { area: AreaFormValues }) {
  const [state, action] = useActionState<FormState, FormData>(saveArea, {});
  const [icon, setIcon] = useState(area.icon);
  const fe = state.fieldErrors;

  return (
    <StatefulForm action={action} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <input type="hidden" name="id" value={area.id ?? ""} />
      <input type="hidden" name="icon" value={icon} />
      <div className="min-w-0 space-y-6">
        <FormAlert state={state} />
        <div className="space-y-5 bg-white p-6">
          <div>
            <label htmlFor="title" className="field-label">Nome do serviço *</label>
            <input id="title" name="title" defaultValue={area.title} required className="field !text-lg" />
            <FieldError errors={fe} name="title" />
          </div>
          <div>
            <label htmlFor="summary" className="field-label">Resumo *</label>
            <textarea id="summary" name="summary" defaultValue={area.summary} rows={3} maxLength={400} className="field resize-y" />
            <p className="mt-1 text-xs text-muted">Texto curto exibido nos cartões da página inicial e da listagem.</p>
            <FieldError errors={fe} name="summary" />
          </div>
        </div>
        <div>
          <p className="field-label">Descrição detalhada</p>
          <RichTextEditor name="description" defaultValue={area.description} minHeight={240} placeholder="Descreva o serviço em detalhes…" />
        </div>
        <div className="space-y-5 bg-white p-6">
          <div>
            <label htmlFor="situations" className="field-label">Principais situações atendidas</label>
            <textarea id="situations" name="situations" defaultValue={area.situations} rows={6} className="field resize-y" placeholder={"Uma situação por linha"} />
            <p className="mt-1 text-xs text-muted">Escreva uma situação por linha. Cada linha vira um item da lista.</p>
          </div>
          <div>
            <label htmlFor="complementary" className="field-label">Informações complementares</label>
            <textarea id="complementary" name="complementary" defaultValue={area.complementary} rows={4} className="field resize-y" />
          </div>
        </div>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-4 bg-white p-6">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="active" defaultChecked={area.active} className="h-4 w-4 accent-[var(--color-gold-dark)]" />
            Ativo (visível no site)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="showInQuoteForm" defaultChecked={area.showInQuoteForm} className="h-4 w-4 accent-[var(--color-gold-dark)]" />
            Exibir no formulário de orçamento
          </label>
          <div>
            <label htmlFor="order" className="field-label">Ordem de exibição</label>
            <input id="order" name="order" type="number" min={0} defaultValue={area.order} className="field" />
          </div>
          <SubmitButton className="btn btn-dark w-full">
            <Save className="h-4 w-4" /> Salvar
          </SubmitButton>
        </div>

        <div className="bg-white p-6">
          <p className="field-label">Ícone</p>
          <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Ícone">
            {Object.entries(AREA_ICONS).map(([key, { label }]) => (
              <button
                type="button"
                key={key}
                role="radio"
                aria-checked={icon === key}
                title={label}
                aria-label={label}
                onClick={() => setIcon(key)}
                className={`flex aspect-square items-center justify-center border transition-colors ${icon === key ? "border-gold bg-brown-900 text-gold-light" : "border-line text-brown-700 hover:border-gold"}`}
              >
                <AreaIcon name={key} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 bg-white p-6">
          <ImageField name="image" label="Imagem ilustrativa (opcional)" defaultValue={area.image} />
          <div>
            <label htmlFor="slug" className="field-label">Endereço amigável</label>
            <input id="slug" name="slug" defaultValue={area.slug} placeholder="gerado a partir do nome" className="field" />
          </div>
        </div>
      </aside>
    </StatefulForm>
  );
}
