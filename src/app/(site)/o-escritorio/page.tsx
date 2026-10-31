/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatPhone, lines, telLink, whatsappLink } from "@/lib/format";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { TeamCard } from "@/components/site/TeamCard";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = {
  title: "O Escritório",
  description: "Conheça a história, os valores, a forma de atuação e a equipe do escritório.",
  alternates: { canonical: "/o-escritorio" },
};

export default async function OfficePage() {
  const [s, team] = await Promise.all([
    getSettings(),
    db.teamMember.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { areas: { where: { active: true }, select: { title: true }, orderBy: { order: "asc" } } },
    }),
  ]);

  const pillars = [
    { title: "Missão", text: s.officeMission },
    { title: "Visão", text: s.officeVision },
  ].filter((p) => p.text.trim());
  const values = lines(s.officeValues);

  return (
    <>
      <PageHeader eyebrow="O Escritório" title={s.officeName} text={s.officeIntro} crumbs={[{ label: "O Escritório" }]} />

      {s.officeHistory.trim() && (
        <section className="py-20 md:py-28">
          <div className={`container-site grid gap-14 ${s.officePhoto ? "lg:grid-cols-[1fr_0.8fr] lg:gap-20" : ""}`}>
            <Reveal className={s.officePhoto ? "" : "mx-auto max-w-3xl"}>
              <p className="eyebrow">Nossa trajetória</p>
              <h2 className="mt-4 text-4xl text-brown-900 md:text-5xl">História</h2>
              <div className="mt-7 space-y-5 text-[1.05rem] leading-relaxed text-ink/80">
                {lines(s.officeHistory).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
            {s.officePhoto && (
              <Reveal delay={120} className="relative mx-auto w-full max-w-md">
                <div aria-hidden className="arch absolute inset-0 translate-x-5 translate-y-5 border border-gold/60" />
                <div className="arch relative aspect-[4/5]">
                  <img src={s.officePhoto} alt={`Fotografia institucional de ${s.officeName}`} className="h-full w-full object-cover" />
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {(pillars.length > 0 || values.length > 0) && (
        <section className="bg-white py-20 md:py-24">
          <div className="container-site">
            <Reveal className="text-center">
              <p className="eyebrow justify-center">Princípios</p>
              <h2 className="mt-4 text-4xl text-brown-900 md:text-5xl">O que nos orienta</h2>
            </Reveal>
            <div className="mt-14 grid gap-px bg-line md:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 100} className="bg-white p-9">
                  <span className="font-serif text-5xl text-gold">0{i + 1}</span>
                  <h3 className="mt-4 text-2xl text-brown-900">{p.title}</h3>
                  <p className="mt-3 leading-relaxed whitespace-pre-line text-ink/80">{p.text}</p>
                </Reveal>
              ))}
              {values.length > 0 && (
                <Reveal delay={pillars.length * 100} className="bg-white p-9">
                  <span className="font-serif text-5xl text-gold">0{pillars.length + 1}</span>
                  <h3 className="mt-4 text-2xl text-brown-900">Valores</h3>
                  <ul className="mt-3 space-y-2 text-ink/80">
                    {values.map((v) => (
                      <li key={v} className="flex gap-3">
                        <span className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                        {v}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {s.officeApproach.trim() && (
        <section className="bg-sand py-20 md:py-24">
          <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Forma de atuação</p>
              <h2 className="mt-4 text-4xl text-brown-900 md:text-5xl">Relacionamento com o cliente</h2>
            </Reveal>
            <Reveal delay={120} className="space-y-5 border-l border-gold/50 pl-8 text-[1.05rem] leading-relaxed text-ink/80">
              {lines(s.officeApproach).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="py-20 md:py-28" id="equipe">
          <div className="container-site">
            <Reveal>
              <p className="eyebrow">Equipe</p>
              <h2 className="mt-4 text-4xl text-brown-900 md:text-5xl">Advogados e integrantes</h2>
            </Reveal>
            <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={(i % 3) * 100}>
                  <TeamCard member={m} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {(s.phone || s.email || s.address) && (
        <section className="border-t border-line bg-white py-14">
          <div className="container-site flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl text-brown-900">Fale com o escritório</h2>
            <ul className="flex flex-col gap-4 text-sm text-ink/80 md:flex-row md:gap-10">
              {s.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold" />
                  <a href={telLink(s.phone)} className="hover:text-brown-700">{formatPhone(s.phone)}</a>
                </li>
              )}
              {s.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold" />
                  <a href={`mailto:${s.email}`} className="hover:text-brown-700">{s.email}</a>
                </li>
              )}
              {s.address && (
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gold" />
                  <Link href="/contato" className="hover:text-brown-700">Ver endereço e mapa</Link>
                </li>
              )}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={s.homeCtaTitle} text={s.homeCtaText} whatsappHref={whatsappLink(s.whatsapp, s.whatsappDefaultMessage)} />
    </>
  );
}
