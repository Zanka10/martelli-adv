"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { saveGeneralSettings } from "../../actions/settings";
import type { FormState } from "../../actions/types";
import type { SiteSettings } from "@/lib/settings";
import { FormAlert, StatefulForm, SubmitButton } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";
import { Section, TextArea, TextField } from "@/components/admin/SettingsFields";

const SECTIONS = [
  ["identidade", "Identidade"],
  ["contato", "Contato"],
  ["redes", "Redes sociais"],
  ["inicio", "Página inicial"],
  ["orcamento", "Orçamento"],
  ["privacidade", "Privacidade"],
  ["seo", "SEO"],
];

export function SettingsForm({ s }: { s: SiteSettings }) {
  const [state, action] = useActionState<FormState, FormData>(saveGeneralSettings, {});
  const fe = state.fieldErrors;

  return (
    <div className="grid gap-6 lg:grid-cols-[12rem_1fr]">
      <nav aria-label="Seções" className="hidden lg:block">
        <ul className="sticky top-6 space-y-1 text-sm">
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="block border-l-2 border-transparent px-3 py-1.5 text-brown-700 hover:border-gold hover:text-brown-900">{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <StatefulForm action={action} className="min-w-0 space-y-6">
        <FormAlert state={state} />

        <Section id="identidade" title="Identidade">
          <TextField name="officeName" label="Nome do escritório *" defaultValue={s.officeName} errors={fe} />
          <TextArea name="footerText" label="Frase institucional do rodapé" defaultValue={s.footerText} rows={2} errors={fe} />
          <div className="max-w-sm">
            <ImageField name="logo" label="Logotipo" defaultValue={s.logo} aspect="aspect-[3/1]" hint="Opcional. PNG ou WebP com fundo transparente, em versão clara (o cabeçalho é escuro). Sem logotipo, o site usa a assinatura tipográfica." />
          </div>
        </Section>

        <Section id="contato" title="Contato" description="Campos vazios ficam ocultos no site.">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField name="phone" label="Telefone comercial" defaultValue={s.phone} placeholder="(00) 0000-0000" errors={fe} />
            <TextField name="whatsapp" label="WhatsApp comercial" defaultValue={s.whatsapp} placeholder="(00) 00000-0000" hint="Recebe as solicitações de orçamento." errors={fe} />
          </div>
          <TextField name="email" label="E-mail" type="email" defaultValue={s.email} errors={fe} />
          <TextArea name="address" label="Endereço" defaultValue={s.address} rows={3} errors={fe} />
          <TextField
            name="mapEmbedUrl"
            label="Mapa (opcional)"
            defaultValue={s.mapEmbedUrl}
            hint="No Google Maps: Compartilhar › Incorporar um mapa › copie apenas o endereço do atributo src. Sem ele, o mapa é gerado a partir do endereço."
            errors={fe}
          />
          <TextArea name="businessHours" label="Horário de atendimento" defaultValue={s.businessHours} rows={3} hint="Ex.: Segunda a sexta, das 9h às 18h. Uma informação por linha." errors={fe} />
          <TextArea name="whatsappDefaultMessage" label="Mensagem inicial do botão de WhatsApp" defaultValue={s.whatsappDefaultMessage} rows={2} errors={fe} />
        </Section>

        <Section id="redes" title="Redes sociais" description="Informe o endereço completo do perfil.">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField name="instagram" label="Instagram" defaultValue={s.instagram} placeholder="https://instagram.com/…" errors={fe} />
            <TextField name="facebook" label="Facebook" defaultValue={s.facebook} placeholder="https://facebook.com/…" errors={fe} />
            <TextField name="linkedin" label="LinkedIn" defaultValue={s.linkedin} placeholder="https://linkedin.com/company/…" errors={fe} />
            <TextField name="youtube" label="YouTube" defaultValue={s.youtube} placeholder="https://youtube.com/@…" errors={fe} />
          </div>
        </Section>

        <Section id="inicio" title="Página inicial">
          <TextField name="heroEyebrow" label="Chamada acima do título" defaultValue={s.heroEyebrow} errors={fe} />
          <TextArea name="heroTitle" label="Título principal" defaultValue={s.heroTitle} rows={2} errors={fe} />
          <TextArea name="heroText" label="Texto de apresentação" defaultValue={s.heroText} rows={3} errors={fe} />
          <div className="max-w-xs">
            <ImageField name="heroImage" label="Imagem do banner" defaultValue={s.heroImage} aspect="aspect-[3/4]" hint="Formato vertical. Exibida em moldura em arco." />
          </div>
          <TextField name="homeCtaTitle" label="Título da chamada para atendimento" defaultValue={s.homeCtaTitle} errors={fe} />
          <TextArea name="homeCtaText" label="Texto da chamada para atendimento" defaultValue={s.homeCtaText} rows={2} errors={fe} />
        </Section>

        <Section id="orcamento" title="Solicitar orçamento">
          <TextArea name="quoteIntro" label="Texto de introdução" defaultValue={s.quoteIntro} rows={3} errors={fe} />
          <TextArea name="feesNotice" label="Aviso sobre honorários" defaultValue={s.feesNotice} rows={3} hint="Exibido antes do envio da solicitação." errors={fe} />
        </Section>

        <Section id="privacidade" title="Aviso de privacidade" description="Linhas curtas sem ponto final são exibidas como subtítulos.">
          <TextArea name="privacyNotice" label="Texto da política de privacidade" defaultValue={s.privacyNotice} rows={16} errors={fe} />
        </Section>

        <Section id="seo" title="SEO">
          <TextField name="seoTitle" label="Título padrão do site" defaultValue={s.seoTitle} errors={fe} />
          <TextArea name="seoDescription" label="Descrição padrão" defaultValue={s.seoDescription} rows={3} hint="Ideal: até 160 caracteres." errors={fe} />
        </Section>

        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton className="btn btn-dark shadow-xl">
            <Save className="h-4 w-4" /> Salvar configurações
          </SubmitButton>
        </div>
      </StatefulForm>
    </div>
  );
}
