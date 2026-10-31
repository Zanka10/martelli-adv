"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { saveOfficeContent } from "../../actions/settings";
import type { FormState } from "../../actions/types";
import type { SiteSettings } from "@/lib/settings";
import { FormAlert, StatefulForm, SubmitButton } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";
import { Section, TextArea, TextField } from "@/components/admin/SettingsFields";

export function OfficeForm({ s }: { s: SiteSettings }) {
  const [state, action] = useActionState<FormState, FormData>(saveOfficeContent, {});
  const fe = state.fieldErrors;
  return (
    <StatefulForm action={action} className="space-y-6">
      <FormAlert state={state} />
      <Section title="Página “O Escritório”" description="Seções sem conteúdo ficam ocultas no site. Separe parágrafos com uma linha em branco.">
        <TextArea name="officeIntro" label="Texto de abertura" defaultValue={s.officeIntro} rows={2} errors={fe} />
        <TextArea name="officeHistory" label="História e trajetória" defaultValue={s.officeHistory} rows={8} errors={fe} />
        <div className="grid gap-5 md:grid-cols-2">
          <TextArea name="officeMission" label="Missão" defaultValue={s.officeMission} rows={4} errors={fe} />
          <TextArea name="officeVision" label="Visão" defaultValue={s.officeVision} rows={4} errors={fe} />
        </div>
        <TextArea name="officeValues" label="Valores" defaultValue={s.officeValues} rows={5} hint="Um valor por linha." errors={fe} />
        <TextArea name="officeApproach" label="Forma de atuação e relacionamento com os clientes" defaultValue={s.officeApproach} rows={5} errors={fe} />
        <div className="max-w-sm">
          <ImageField name="officePhoto" label="Fotografia institucional" defaultValue={s.officePhoto} aspect="aspect-[4/5]" hint="Usada na página O Escritório e na página inicial." />
        </div>
      </Section>
      <Section title="Apresentação na página inicial">
        <TextField name="homeAboutTitle" label="Título" defaultValue={s.homeAboutTitle} errors={fe} />
        <TextArea name="homeAboutText" label="Texto" defaultValue={s.homeAboutText} rows={5} errors={fe} />
      </Section>
      <div className="sticky bottom-4 flex justify-end">
        <SubmitButton className="btn btn-dark shadow-xl">
          <Save className="h-4 w-4" /> Salvar alterações
        </SubmitButton>
      </div>
    </StatefulForm>
  );
}
