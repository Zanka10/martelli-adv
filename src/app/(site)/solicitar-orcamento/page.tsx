import type { Metadata } from "next";
import { ClipboardList, MessageCircle, Scale } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { whatsappNumber } from "@/lib/format";
import { PageHeader } from "@/components/site/PageHeader";
import { QuoteForm } from "@/components/site/QuoteForm";

export const metadata: Metadata = {
  title: "Solicitar Orçamento",
  description: "Descreva sua necessidade jurídica e envie uma solicitação de avaliação ao escritório pelo WhatsApp.",
  alternates: { canonical: "/solicitar-orcamento" },
};

const HOW = [
  { icon: ClipboardList, title: "Descreva sua situação", text: "Preencha o formulário com as informações principais." },
  { icon: MessageCircle, title: "Envie pelo WhatsApp", text: "A mensagem é montada automaticamente para você revisar e enviar." },
  { icon: Scale, title: "Avaliação do escritório", text: "Analisamos a demanda e retornamos o contato no período indicado." },
];

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const { area: areaSlug } = await searchParams;
  const [s, areas] = await Promise.all([
    getSettings(),
    db.practiceArea.findMany({
      where: { active: true, showInQuoteForm: true },
      orderBy: [{ order: "asc" }, { title: "asc" }],
      select: { title: true, slug: true },
    }),
  ]);
  const initialArea = areas.find((a) => a.slug === areaSlug)?.title;
  const number = whatsappNumber(s.whatsapp);

  return (
    <>
      <PageHeader eyebrow="Solicitar Orçamento" title="Solicite uma avaliação da sua demanda" text={s.quoteIntro} crumbs={[{ label: "Solicitar Orçamento" }]} />

      <section className="py-14 md:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div className="bg-white p-6 shadow-[0_30px_60px_-40px_rgba(59,36,26,0.35)] sm:p-10 md:p-12">
            <QuoteForm areas={areas.map((a) => a.title)} initialArea={initialArea} officeName={s.officeName} whatsappNumber={number || null} feesNotice={s.feesNotice} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">Como funciona</h2>
            <ol className="mt-6 space-y-7">
              {HOW.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold-dark">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-serif text-xl text-brown-900">
                      {i + 1}. {title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-muted">
              Seus dados não são armazenados neste site: a mensagem é montada no seu dispositivo e enviada por você pelo WhatsApp.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
