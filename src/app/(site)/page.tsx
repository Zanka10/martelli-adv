/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Clock, Eye, Lock, Mail, MapPin, MessagesSquare, Phone } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatPhone, lines, telLink, whatsappLink } from "@/lib/format";
import { postListInclude, publishedWhere } from "@/lib/posts";
import { AreaIcon } from "@/components/icons";
import { Reveal } from "@/components/site/Reveal";
import { PostCard } from "@/components/site/PostCard";
import { WhatsAppIcon } from "@/components/site/SocialIcons";

const PRINCIPLES = [
  { icon: MessagesSquare, title: "Atendimento próximo", text: "Escuta atenta e acompanhamento individual de cada demanda." },
  { icon: Lock, title: "Ética e sigilo", text: "Atuação pautada pelos deveres da advocacia e pela confidencialidade." },
  { icon: Eye, title: "Clareza em cada etapa", text: "Comunicação objetiva sobre riscos, caminhos possíveis e andamento." },
];

export default async function HomePage() {
  const [s, areas, posts] = await Promise.all([
    getSettings(),
    db.practiceArea.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { title: "asc" }], take: 6 }),
    db.post.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take: 3, include: postListInclude }),
  ]);
  const wa = whatsappLink(s.whatsapp, s.whatsappDefaultMessage);
  const [firstName, ...restName] = s.officeName.split(/\s+/);

  return (
    <>
      {/* Banner principal */}
      <section className="texture-dark relative overflow-hidden">
        <div className="container-site grid items-center gap-14 py-16 md:py-24 lg:min-h-[calc(100vh-86px)] lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="eyebrow eyebrow-light animate-fade-up">{s.heroEyebrow}</p>
            <p className="mt-8 animate-fade-up font-serif text-xl tracking-[0.3em] text-gold-light uppercase [animation-delay:80ms]">
              {firstName} <span className="text-cream/60">{restName.join(" ")}</span>
            </p>
            <h1 className="mt-5 animate-fade-up text-[2.6rem] leading-[1.05] text-cream sm:text-6xl lg:text-[4.4rem] [animation-delay:160ms]">
              {s.heroTitle}
            </h1>
            <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-cream/70 md:text-lg [animation-delay:240ms]">{s.heroText}</p>
            <div className="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row [animation-delay:320ms]">
              <Link href="/areas-de-atuacao" className="btn btn-gold">
                Conheça as áreas de atuação <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/solicitar-orcamento" className="btn btn-outline-light">
                Solicitar atendimento
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-md animate-fade-up md:block [animation-delay:200ms]">
            <div aria-hidden className="arch absolute inset-0 translate-x-5 translate-y-5 border border-gold/50" />
            <div className="arch relative aspect-[3/4] bg-brown-800">
              {s.heroImage ? (
                <>
                  <img src={s.heroImage} alt="" className="h-full w-full object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brown-950/70 via-brown-900/10 to-transparent" />
                </>
              ) : (
                <div aria-hidden className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-brown-700 to-brown-950">
                  <div className="absolute inset-x-[18%] top-[22%] bottom-0 flex justify-between">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span key={i} className="w-[12%] bg-gradient-to-b from-gold/25 via-gold/10 to-transparent" />
                    ))}
                  </div>
                  <span className="absolute inset-x-[12%] top-[18%] h-px bg-gold/40" />
                  <span className="relative font-serif text-[9rem] leading-none text-gold/80">{firstName.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Princípios */}
      <section className="border-b border-line bg-white">
        <div className="container-site grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {PRINCIPLES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100} className="flex gap-5 py-9 md:px-8 md:first:pl-0 md:last:pr-0">
              <Icon className="h-7 w-7 shrink-0 text-gold" strokeWidth={1.3} />
              <div>
                <h2 className="text-xl text-brown-900">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Áreas de atuação */}
      {areas.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-site">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <Reveal>
                <p className="eyebrow">Áreas de atuação</p>
                <h2 className="mt-4 max-w-xl text-4xl text-brown-900 md:text-5xl">Orientação jurídica para cada necessidade</h2>
              </Reveal>
              <Reveal delay={100}>
                <Link href="/areas-de-atuacao" className="link-gold">
                  Ver todas as áreas <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>
            <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area, i) => (
                <Reveal as="li" key={area.id} delay={(i % 3) * 90} className="bg-cream">
                  <Link href={`/areas-de-atuacao/${area.slug}`} className="group relative flex h-full flex-col p-8 transition-colors duration-300 hover:bg-white md:p-10">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                    <AreaIcon name={area.icon} className="h-10 w-10 text-gold-dark" />
                    <h3 className="mt-6 text-2xl text-brown-900">{area.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{area.summary}</p>
                    <span className="link-gold mt-auto pt-7">
                      Saiba mais <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Institucional */}
      <section className="overflow-hidden bg-sand py-20 md:py-28">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="arch absolute inset-0 -translate-x-5 translate-y-5 bg-brown-700/15" />
            <div className="arch relative aspect-[4/5] bg-brown-900">
              {s.officePhoto ? (
                <img src={s.officePhoto} alt={`Instalações de ${s.officeName}`} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <div aria-hidden className="texture-dark flex h-full w-full flex-col items-center justify-center gap-5 text-center">
                  <span className="gold-rule" />
                  <span className="px-10 font-serif text-3xl leading-snug text-cream/85 italic">Ética, técnica e compromisso</span>
                  <span className="gold-rule" />
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">O escritório</p>
            <h2 className="mt-4 text-4xl text-brown-900 md:text-5xl">{s.homeAboutTitle}</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/80">
              {lines(s.homeAboutText).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link href="/o-escritorio" className="btn btn-dark mt-9">
              Conheça o escritório <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Publicações */}
      {posts.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-site">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <Reveal>
                <p className="eyebrow">Publicações</p>
                <h2 className="mt-4 text-4xl text-brown-900 md:text-5xl">Artigos e conteúdos recentes</h2>
              </Reveal>
              <Reveal delay={100}>
                <Link href="/publicacoes" className="link-gold">
                  Ver todas as publicações <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 90}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chamada para atendimento */}
      <section className="texture-dark relative overflow-hidden">
        <div aria-hidden className="arch pointer-events-none absolute -bottom-56 -left-20 h-[34rem] w-[22rem] border border-gold/15" />
        <div className="container-site relative grid gap-14 py-20 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow eyebrow-light">Atendimento</p>
            <h2 className="mt-4 text-4xl text-cream md:text-5xl">{s.homeCtaTitle}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-cream/70">{s.homeCtaText}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/solicitar-orcamento" className="btn btn-gold">
                Solicitar orçamento <ArrowRight className="h-4 w-4" />
              </Link>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                  <WhatsAppIcon className="h-4 w-4" /> Falar pelo WhatsApp
                </a>
              )}
            </div>
          </Reveal>
          {(s.phone || s.email || s.address || s.businessHours) && (
            <Reveal delay={120}>
              <ul className="space-y-6 border-l border-gold/30 pl-8 text-cream/80">
                {s.phone && (
                  <li className="flex gap-4">
                    <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-bold tracking-[0.16em] text-cream/50 uppercase">Telefone</p>
                      <a href={telLink(s.phone)} className="mt-1 block hover:text-gold-light">{formatPhone(s.phone)}</a>
                    </div>
                  </li>
                )}
                {s.email && (
                  <li className="flex gap-4">
                    <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-bold tracking-[0.16em] text-cream/50 uppercase">E-mail</p>
                      <a href={`mailto:${s.email}`} className="mt-1 block break-all hover:text-gold-light">{s.email}</a>
                    </div>
                  </li>
                )}
                {s.address && (
                  <li className="flex gap-4">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-bold tracking-[0.16em] text-cream/50 uppercase">Endereço</p>
                      <p className="mt-1 whitespace-pre-line">{s.address}</p>
                    </div>
                  </li>
                )}
                {s.businessHours && (
                  <li className="flex gap-4">
                    <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-bold tracking-[0.16em] text-cream/50 uppercase">Horário</p>
                      <p className="mt-1 whitespace-pre-line">{s.businessHours}</p>
                    </div>
                  </li>
                )}
              </ul>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
