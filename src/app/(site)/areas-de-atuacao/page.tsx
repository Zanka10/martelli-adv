import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/format";
import { AreaIcon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = {
  title: "Áreas de Atuação",
  description: "Conheça as áreas do Direito em que o escritório atua e solicite uma avaliação da sua demanda.",
  alternates: { canonical: "/areas-de-atuacao" },
};

export default async function AreasPage() {
  const [s, areas] = await Promise.all([
    getSettings(),
    db.practiceArea.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { title: "asc" }] }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Áreas de Atuação"
        title="Atuação jurídica com atenção a cada detalhe"
        text="Conheça os serviços prestados pelo escritório. Cada caso é analisado individualmente, considerando suas particularidades."
        crumbs={[{ label: "Áreas de Atuação" }]}
      />

      <section className="py-20 md:py-24">
        <div className="container-site">
          {areas.length === 0 ? (
            <p className="text-center text-muted">As áreas de atuação serão publicadas em breve.</p>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {areas.map((area, i) => (
                <Reveal as="li" key={area.id} delay={60}>
                  <Link
                    href={`/areas-de-atuacao/${area.slug}`}
                    className="group grid gap-6 py-10 transition-colors md:grid-cols-[5rem_1fr_auto] md:items-center md:gap-10 md:px-6 md:hover:bg-white"
                  >
                    <div className="flex items-center gap-5 md:block">
                      <span className="font-serif text-lg text-gold-dark md:mb-3 md:block">{String(i + 1).padStart(2, "0")}</span>
                      <AreaIcon name={area.icon} className="h-10 w-10 text-brown-700 transition-colors group-hover:text-gold-dark" />
                    </div>
                    <div>
                      <h2 className="text-3xl text-brown-900 md:text-4xl">{area.title}</h2>
                      <p className="mt-3 max-w-3xl leading-relaxed text-muted">{area.summary}</p>
                    </div>
                    <span className="link-gold">
                      Detalhes <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CtaBand
        title="Não encontrou sua situação?"
        text="Descreva sua necessidade. Avaliaremos se o escritório pode atendê-la ou indicaremos o melhor encaminhamento."
        whatsappHref={whatsappLink(s.whatsapp, s.whatsappDefaultMessage)}
      />
    </>
  );
}
