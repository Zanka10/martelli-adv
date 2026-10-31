/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { lines, whatsappLink } from "@/lib/format";
import { stripHtml } from "@/lib/sanitize";
import { AreaIcon } from "@/components/icons";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { TeamCard } from "@/components/site/TeamCard";
import { WhatsAppIcon } from "@/components/site/SocialIcons";

type Props = { params: Promise<{ slug: string }> };

const getArea = (slug: string) =>
  db.practiceArea.findFirst({
    where: { slug, active: true },
    include: {
      members: {
        where: { published: true },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: { areas: { where: { active: true }, select: { title: true } } },
      },
    },
  });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await getArea((await params).slug);
  if (!area) return {};
  return {
    title: area.title,
    description: area.summary || stripHtml(area.description).slice(0, 160),
    alternates: { canonical: `/areas-de-atuacao/${area.slug}` },
    openGraph: { title: area.title, description: area.summary, images: area.image ? [area.image] : undefined },
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const [area, s, others] = await Promise.all([
    getArea(slug),
    getSettings(),
    db.practiceArea.findMany({ where: { active: true, slug: { not: slug } }, orderBy: { order: "asc" }, select: { title: true, slug: true, icon: true } }),
  ]);
  if (!area) notFound();

  const situations = lines(area.situations);
  const quoteHref = `/solicitar-orcamento?area=${area.slug}`;
  const wa = whatsappLink(s.whatsapp, `Olá! Gostaria de atendimento na área de ${area.title}.`);

  return (
    <>
      <PageHeader
        eyebrow="Área de atuação"
        title={area.title}
        text={area.summary}
        crumbs={[{ href: "/areas-de-atuacao", label: "Áreas de Atuação" }, { label: area.title }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            {area.image && (
              <Reveal className="mb-12 aspect-[16/8] overflow-hidden">
                <img src={area.image} alt={area.title} className="h-full w-full object-cover" />
              </Reveal>
            )}
            {area.description && (
              <Reveal>
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: area.description }} />
              </Reveal>
            )}

            {situations.length > 0 && (
              <Reveal className="mt-14 bg-white p-8 md:p-10">
                <h2 className="text-3xl text-brown-900">Principais situações atendidas</h2>
                <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                  {situations.map((item) => (
                    <li key={item} className="flex gap-3 text-ink/85">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-gold-dark" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {area.complementary.trim() && (
              <Reveal className="mt-12 border-l-2 border-gold pl-7">
                <h2 className="text-2xl text-brown-900">Informações complementares</h2>
                <div className="mt-4 space-y-3 leading-relaxed text-ink/80">
                  {lines(area.complementary).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="texture-dark p-8">
              <AreaIcon name={area.icon} className="h-10 w-10 text-gold" />
              <h2 className="mt-5 text-2xl text-cream">Precisa de orientação em {area.title}?</h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{s.feesNotice}</p>
              <div className="mt-7 flex flex-col gap-3">
                <Link href={quoteHref} className="btn btn-gold">
                  Solicitar orçamento <ArrowRight className="h-4 w-4" />
                </Link>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                    <WhatsAppIcon className="h-4 w-4" /> Solicitar atendimento
                  </a>
                )}
              </div>
            </div>

            {others.length > 0 && (
              <nav aria-label="Outras áreas de atuação" className="border border-line bg-white p-7">
                <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">Outras áreas</h2>
                <ul className="mt-4 divide-y divide-line">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/areas-de-atuacao/${o.slug}`} className="group flex items-center gap-3 py-3 text-sm text-brown-900 hover:text-brown-700">
                        <AreaIcon name={o.icon} className="h-5 w-5 text-gold-dark" />
                        <span className="flex-1">{o.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
        </div>
      </section>

      {area.members.length > 0 && (
        <section className="bg-sand py-20">
          <div className="container-site">
            <h2 className="text-4xl text-brown-900">Profissionais desta área</h2>
            <div className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {area.members.map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
