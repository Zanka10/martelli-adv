import "server-only";
import { cache } from "react";
import { db } from "./db";

/**
 * Valores padrão de todas as configurações editáveis pelo painel.
 * Dados de contato começam vazios de propósito: o site oculta o que não foi preenchido
 * para não exibir informações não confirmadas pelo escritório.
 */
export const SETTINGS_DEFAULTS = {
  // Identidade
  officeName: "Martelli Advogados e Associados",
  logo: "",
  // Contato
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  mapEmbedUrl: "",
  businessHours: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  youtube: "",
  whatsappDefaultMessage: "Olá! Gostaria de mais informações sobre o atendimento da Martelli Advogados e Associados.",
  // Página inicial
  heroEyebrow: "Advocacia e consultoria jurídica",
  heroTitle: "Compromisso jurídico com seriedade, técnica e proximidade.",
  heroText:
    "Cada demanda recebe atenção individual, análise cuidadosa e orientação clara, para que você tome decisões com segurança.",
  heroImage: "",
  homeAboutTitle: "Um escritório construído sobre confiança",
  homeAboutText:
    "A Martelli Advogados e Associados atua com ética, discrição e dedicação, acompanhando de perto cada cliente e cada etapa do caso. Nosso compromisso é oferecer uma advocacia responsável, transparente e orientada a resultados possíveis e bem fundamentados.",
  homeCtaTitle: "Precisa de orientação jurídica?",
  homeCtaText: "Conte-nos brevemente sua situação. Nossa equipe fará uma avaliação inicial e retornará o contato.",
  // O Escritório
  officeIntro:
    "Conheça a forma como trabalhamos, os princípios que orientam nossa atuação e as pessoas que fazem parte do escritório.",
  officeHistory: "",
  officeMission: "",
  officeVision: "",
  officeValues: "",
  officeApproach:
    "Atendimento próximo e personalizado, comunicação clara sobre cada etapa do caso e atuação pautada pela ética profissional e pelo sigilo das informações confiadas ao escritório.",
  officePhoto: "",
  // Orçamento
  quoteIntro:
    "Preencha as informações abaixo para que possamos compreender sua necessidade. Ao final, você poderá revisar os dados e enviá-los diretamente ao nosso WhatsApp.",
  feesNotice:
    "Os honorários são avaliados individualmente, após a análise de cada demanda. O envio desta solicitação não representa contratação, aprovação de orçamento ou definição de valores.",
  // Privacidade
  privacyNotice: `Esta política descreve como a Martelli Advogados e Associados trata os dados pessoais informados neste site, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).

Dados coletados
Coletamos apenas as informações que você nos fornece voluntariamente nos formulários de contato e de solicitação de atendimento, como nome, telefone, e-mail e a descrição da sua necessidade.

Finalidade
Os dados são utilizados exclusivamente para analisar sua solicitação, entrar em contato e prestar as informações solicitadas. Não comercializamos nem compartilhamos seus dados com terceiros para fins de marketing.

Envio pelo WhatsApp
Na solicitação de atendimento, a mensagem é montada no seu próprio dispositivo e enviada por você pelo WhatsApp. O conteúdo passa a estar sujeito também às políticas de privacidade do WhatsApp.

Sigilo
As informações compartilhadas com o escritório são tratadas com sigilo, observando os deveres éticos da advocacia.

Seus direitos
Você pode solicitar a qualquer momento a confirmação, o acesso, a correção ou a exclusão dos seus dados pessoais, entrando em contato pelos canais informados neste site.`,
  // SEO
  seoTitle: "Martelli Advogados e Associados",
  seoDescription:
    "Martelli Advogados e Associados: atendimento jurídico ético, próximo e personalizado. Conheça nossas áreas de atuação e solicite uma avaliação.",
  footerText: "Advocacia pautada pela ética, pelo sigilo e pelo compromisso com cada cliente.",
};

export type SiteSettings = typeof SETTINGS_DEFAULTS;
export type SettingKey = keyof SiteSettings;
export const SETTING_KEYS = Object.keys(SETTINGS_DEFAULTS) as SettingKey[];

/** Conteúdos institucionais que editores também podem alterar (o restante é restrito a administradores). */
export const OFFICE_KEYS: SettingKey[] = [
  "officeIntro",
  "officeHistory",
  "officeMission",
  "officeVision",
  "officeValues",
  "officeApproach",
  "officePhoto",
  "homeAboutTitle",
  "homeAboutText",
];

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db.setting.findMany();
  const settings = { ...SETTINGS_DEFAULTS };
  for (const row of rows) {
    if (row.key in settings) settings[row.key as SettingKey] = row.value;
  }
  return settings;
});

export async function saveSettings(values: Partial<SiteSettings>) {
  const entries = Object.entries(values).filter(([key]) => key in SETTINGS_DEFAULTS);
  await db.$transaction(
    entries.map(([key, value]) =>
      db.setting.upsert({ where: { key }, create: { key, value: value ?? "" }, update: { value: value ?? "" } }),
    ),
  );
}
