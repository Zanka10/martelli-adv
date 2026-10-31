"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Pencil } from "lucide-react";
import { WhatsAppIcon } from "./SocialIcons";

const SERVICE_TYPES = [
  "Consulta e orientação inicial",
  "Análise de documentos ou contrato",
  "Acompanhamento de processo existente",
  "Ingresso com ação judicial",
  "Defesa em processo judicial",
  "Assessoria jurídica contínua",
  "Outro",
];
const PERIODS = ["Manhã", "Tarde", "Início da noite", "Qualquer horário"];
const CONTACT_PREFS = ["WhatsApp", "Ligação telefônica", "E-mail"];
const OTHER_AREA = "Outra / não sei informar";

type Data = {
  area: string;
  serviceType: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  period: string;
  contactPref: string;
  privacy: boolean;
};
type Field = keyof Data;
type Errors = Partial<Record<Field, string>>;

const STEPS: { title: string; fields: Field[] }[] = [
  { title: "Sua necessidade", fields: ["area", "serviceType", "description"] },
  { title: "Seus dados", fields: ["name", "phone", "email", "period", "contactPref"] },
  { title: "Revisão e envio", fields: ["privacy"] },
];

const FIELD_LABELS: Record<Field, string> = {
  area: "Área jurídica de interesse",
  serviceType: "Tipo de atendimento",
  description: "Descrição da situação",
  name: "Nome completo",
  phone: "Telefone com DDD",
  email: "E-mail",
  period: "Melhor período para contato",
  contactPref: "Preferência de contato",
  privacy: "Aviso de privacidade",
};

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validate(data: Data, fields: Field[]): Errors {
  const e: Errors = {};
  const digits = data.phone.replace(/\D/g, "");
  for (const f of fields) {
    if (f === "area" && !data.area) e.area = "Selecione a área jurídica de interesse.";
    if (f === "serviceType" && !data.serviceType) e.serviceType = "Selecione o tipo de atendimento desejado.";
    if (f === "description") {
      if (data.description.trim().length < 20) e.description = "Descreva sua situação com pelo menos 20 caracteres.";
    }
    if (f === "name" && data.name.trim().split(/\s+/).length < 2) e.name = "Informe seu nome completo.";
    if (f === "phone" && (digits.length < 10 || digits.length > 11)) e.phone = "Informe um telefone válido com DDD.";
    if (f === "email" && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = "Informe um e-mail válido ou deixe o campo em branco.";
    if (f === "period" && !data.period) e.period = "Selecione o melhor período para contato.";
    if (f === "contactPref" && !data.contactPref) e.contactPref = "Selecione como prefere ser contatado(a).";
    if (f === "privacy" && !data.privacy) e.privacy = "Confirme a leitura do aviso de privacidade para continuar.";
  }
  return e;
}

export function buildWhatsAppMessage(d: Data, officeName: string) {
  return [
    `Olá! Gostaria de solicitar atendimento com a ${officeName}.`,
    "",
    `Nome: ${d.name.trim()}`,
    `Telefone: ${d.phone}`,
    `E-mail: ${d.email.trim() || "Não informado"}`,
    `Área jurídica: ${d.area}`,
    `Tipo de atendimento: ${d.serviceType}`,
    `Melhor horário para contato: ${d.period}`,
    `Preferência de contato: ${d.contactPref}`,
    "",
    "Descrição da solicitação:",
    d.description.trim(),
    "",
    "Aguardo retorno. Obrigado(a)!",
  ].join("\n");
}

type Props = {
  areas: string[];
  initialArea?: string;
  officeName: string;
  whatsappNumber: string | null;
  feesNotice: string;
};

export function QuoteForm({ areas, initialArea, officeName, whatsappNumber, feesNotice }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({
    area: initialArea ?? "",
    serviceType: "",
    description: "",
    name: "",
    phone: "",
    email: "",
    period: "",
    contactPref: "",
    privacy: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const areaOptions = useMemo(() => [...areas, OTHER_AREA], [areas]);

  const set = <K extends Field>(field: K, value: Data[K]) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const goTo = (n: number) => {
    setStep(n);
    setErrors({});
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    if (first) requestAnimationFrame(() => document.getElementById(`q-${first}`)?.focus());
  };

  function next() {
    const errs = validate(data, STEPS[step].fields);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    goTo(step + 1);
  }

  function send() {
    const all = STEPS.flatMap((s) => s.fields);
    const errs = validate(data, all);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const stepWithError = STEPS.findIndex((s) => s.fields.some((f) => errs[f]));
      if (stepWithError !== step) {
        setStep(stepWithError);
        requestAnimationFrame(() => focusFirstError(errs));
      } else focusFirstError(errs);
      return;
    }
    if (!whatsappNumber) return;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(data, officeName))}`;
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const errorList = Object.entries(errors).filter(([, v]) => v) as [Field, string][];

  const fieldProps = (f: Field) => ({
    id: `q-${f}`,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `q-${f}-erro` : undefined,
  });
  const Err = ({ f }: { f: Field }) =>
    errors[f] ? (
      <p id={`q-${f}-erro`} className="field-error">
        {errors[f]}
      </p>
    ) : null;

  const choice = (active: boolean) =>
    `flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-sm transition-colors ${
      active ? "border-gold bg-gold/10 text-brown-900" : "border-line bg-white text-ink hover:border-gold/60"
    }`;

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Indicador de etapas */}
      <ol className="mb-10 grid grid-cols-3 gap-2" aria-label="Etapas do formulário">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && goTo(i)}
              aria-current={i === step ? "step" : undefined}
              className="group w-full text-left disabled:cursor-default"
            >
              <span className={`block h-0.5 transition-colors ${i <= step ? "bg-gold" : "bg-line"}`} />
              <span className="mt-3 flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold ${
                    i < step ? "bg-gold text-brown-950" : i === step ? "bg-brown-900 text-cream" : "border border-line text-muted"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={`hidden text-xs font-bold tracking-[0.08em] uppercase sm:inline ${i === step ? "text-brown-900" : "text-muted"}`}>{s.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {errorList.length > 1 && (
        <div role="alert" className="mb-8 flex gap-3 border border-[#e3b3a5] bg-[#fbf0ec] p-4 text-sm text-[#7d2d18]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Revise os campos a seguir:</p>
            <ul className="mt-1 list-disc pl-5">
              {errorList.map(([f, msg]) => (
                <li key={f}>
                  <strong>{FIELD_LABELS[f]}:</strong> {msg}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 2) next();
          else send();
        }}
      >
        {step === 0 && (
          <fieldset className="space-y-7 animate-fade-up">
            <legend className="mb-6 font-serif text-3xl text-brown-900">Conte-nos sobre a sua necessidade</legend>
            <div>
              <label htmlFor="q-area" className="field-label">Área jurídica de interesse *</label>
              <select {...fieldProps("area")} className="field" value={data.area} onChange={(e) => set("area", e.target.value)}>
                <option value="">Selecione…</option>
                {areaOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <Err f="area" />
            </div>
            <div role="radiogroup" aria-labelledby="q-serviceType-label" aria-describedby={errors.serviceType ? "q-serviceType-erro" : undefined}>
              <p id="q-serviceType-label" className="field-label">Tipo de atendimento desejado *</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SERVICE_TYPES.map((t, i) => (
                  <label key={t} className={choice(data.serviceType === t)}>
                    <input
                      type="radio"
                      name="serviceType"
                      id={i === 0 ? "q-serviceType" : undefined}
                      className="accent-[var(--color-gold-dark)]"
                      checked={data.serviceType === t}
                      onChange={() => set("serviceType", t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
              <Err f="serviceType" />
            </div>
            <div>
              <label htmlFor="q-description" className="field-label">Descrição da situação ou necessidade jurídica *</label>
              <textarea
                {...fieldProps("description")}
                rows={6}
                maxLength={1500}
                className="field resize-y"
                placeholder="Descreva brevemente o que aconteceu e o que você precisa. Evite enviar dados sensíveis desnecessários."
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
              />
              <div className="flex justify-between gap-4">
                <Err f="description" />
                <span className="mt-1 ml-auto text-xs text-muted">{data.description.length}/1500</span>
              </div>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-7 animate-fade-up">
            <legend className="mb-6 font-serif text-3xl text-brown-900">Como podemos falar com você?</legend>
            <div>
              <label htmlFor="q-name" className="field-label">Nome completo *</label>
              <input {...fieldProps("name")} autoComplete="name" className="field" value={data.name} onChange={(e) => set("name", e.target.value)} />
              <Err f="name" />
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="q-phone" className="field-label">Telefone com DDD *</label>
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(00) 00000-0000"
                  className="field"
                  value={data.phone}
                  onChange={(e) => set("phone", maskPhone(e.target.value))}
                />
                <Err f="phone" />
              </div>
              <div>
                <label htmlFor="q-email" className="field-label">
                  E-mail <span className="font-normal text-muted">(opcional)</span>
                </label>
                <input {...fieldProps("email")} type="email" autoComplete="email" className="field" value={data.email} onChange={(e) => set("email", e.target.value)} />
                <Err f="email" />
              </div>
            </div>
            <div>
              <label htmlFor="q-period" className="field-label">Melhor período para contato *</label>
              <select {...fieldProps("period")} className="field" value={data.period} onChange={(e) => set("period", e.target.value)}>
                <option value="">Selecione…</option>
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <Err f="period" />
            </div>
            <div role="radiogroup" aria-labelledby="q-contactPref-label">
              <p id="q-contactPref-label" className="field-label">Preferência de contato *</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {CONTACT_PREFS.map((p, i) => (
                  <label key={p} className={choice(data.contactPref === p)}>
                    <input
                      type="radio"
                      name="contactPref"
                      id={i === 0 ? "q-contactPref" : undefined}
                      className="accent-[var(--color-gold-dark)]"
                      checked={data.contactPref === p}
                      onChange={() => set("contactPref", p)}
                    />
                    {p}
                  </label>
                ))}
              </div>
              <Err f="contactPref" />
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="mb-6 font-serif text-3xl text-brown-900">Revise sua solicitação</h2>
            <div className="divide-y divide-line border border-line bg-white">
              {[0, 1].map((s) => (
                <div key={s} className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-sans text-xs font-bold tracking-[0.16em] text-gold-dark uppercase">{STEPS[s].title}</h3>
                    <button type="button" onClick={() => goTo(s)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-gold-dark">
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                  </div>
                  <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {STEPS[s].fields.map((f) => (
                      <div key={f} className={f === "description" ? "sm:col-span-2" : ""}>
                        <dt className="text-xs text-muted">{FIELD_LABELS[f]}</dt>
                        <dd className="mt-0.5 text-sm whitespace-pre-line text-brown-900">{String(data[f]).trim() || "Não informado"}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <p className="mt-6 border-l-2 border-gold bg-sand px-5 py-4 text-sm leading-relaxed text-ink/85">{feesNotice}</p>

            <div className="mt-6">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/85">
                <input
                  type="checkbox"
                  {...fieldProps("privacy")}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-gold-dark)]"
                  checked={data.privacy}
                  onChange={(e) => set("privacy", e.target.checked)}
                />
                <span>
                  Li e estou de acordo com o{" "}
                  <Link href="/politica-de-privacidade" target="_blank" className="font-semibold text-brown-700 underline decoration-gold underline-offset-2">
                    aviso de privacidade
                  </Link>{" "}
                  e autorizo o uso dos dados informados para contato sobre esta solicitação. *
                </span>
              </label>
              <Err f="privacy" />
            </div>

            {!whatsappNumber && (
              <p role="alert" className="mt-6 border border-line bg-white p-4 text-sm text-ink/85">
                O canal de WhatsApp do escritório ainda não foi configurado. Utilize a página de{" "}
                <Link href="/contato" className="font-semibold text-brown-700 underline">contato</Link> para enviar sua mensagem.
              </p>
            )}

            {sentUrl && (
              <div role="status" className="mt-6 flex gap-3 border border-gold/50 bg-gold/10 p-4 text-sm text-brown-900">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                <p>
                  Abrimos o WhatsApp com a sua mensagem pronta. Revise o texto e toque em <strong>enviar</strong> no aplicativo para concluir.
                  Se ele não abriu,{" "}
                  <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">clique aqui</a>.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-8 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="btn btn-outline">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button type="submit" className="btn btn-dark">
              Continuar <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" className="btn btn-gold" disabled={!whatsappNumber}>
              <WhatsAppIcon className="h-4 w-4" /> Enviar solicitação pelo WhatsApp
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
