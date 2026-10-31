import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { formatPhone, lines, telLink, whatsappLink } from "@/lib/format";
import { Logo } from "./Logo";
import { WhatsAppIcon, socialLinks } from "./SocialIcons";

type Props = { settings: SiteSettings; areas: { title: string; slug: string }[] };

export function Footer({ settings: s, areas }: Props) {
  const social = socialLinks(s);
  const wa = whatsappLink(s.whatsapp);
  const year = new Date().getFullYear();

  return (
    <footer className="texture-dark text-cream/75">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
        <div>
          <Logo name={s.officeName} logo={s.logo} />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">{s.footerText}</p>
          {social.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-gold hover:text-gold-light"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-sans text-xs font-bold tracking-[0.22em] text-gold uppercase">Navegação</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              ["/o-escritorio", "O Escritório"],
              ["/areas-de-atuacao", "Áreas de Atuação"],
              ["/publicacoes", "Publicações"],
              ["/solicitar-orcamento", "Solicitar Orçamento"],
              ["/contato", "Contato"],
              ["/politica-de-privacidade", "Política de Privacidade"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-gold-light">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-bold tracking-[0.22em] text-gold uppercase">Áreas de Atuação</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {areas.slice(0, 6).map((a) => (
              <li key={a.slug}>
                <Link href={`/areas-de-atuacao/${a.slug}`} className="transition-colors hover:text-gold-light">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-bold tracking-[0.22em] text-gold uppercase">Contato</h2>
          <ul className="mt-5 space-y-4 text-sm">
            {s.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={telLink(s.phone)} className="hover:text-gold-light">{formatPhone(s.phone)}</a>
              </li>
            )}
            {wa && (
              <li className="flex gap-3">
                <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">{formatPhone(s.whatsapp)}</a>
              </li>
            )}
            {s.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${s.email}`} className="break-all hover:text-gold-light">{s.email}</a>
              </li>
            )}
            {s.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="whitespace-pre-line">{s.address}</span>
              </li>
            )}
            {s.businessHours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{lines(s.businessHours).map((l) => <span key={l} className="block">{l}</span>)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {s.officeName}. Todos os direitos reservados.</p>
          <Link href="/politica-de-privacidade" className="hover:text-gold-light">Política de Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
