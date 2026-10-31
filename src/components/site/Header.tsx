"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./SocialIcons";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/o-escritorio", label: "O Escritório" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/solicitar-orcamento", label: "Solicitar Orçamento" },
  { href: "/contato", label: "Contato" },
];

type Props = { officeName: string; logo: string; whatsappHref: string | null };

export function Header({ officeName, logo, whatsappHref }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 bg-brown-900 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_12px_30px_-18px_rgba(0,0,0,0.6)]" : ""
      }`}
    >
      <div className={`container-site flex items-center justify-between transition-all duration-300 ${scrolled ? "h-[70px]" : "h-[86px]"}`}>
        <Link href="/" aria-label={`${officeName} — página inicial`}>
          <Logo name={officeName} logo={logo} />
        </Link>

        <nav aria-label="Navegação principal" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative py-2 text-[0.8rem] font-semibold tracking-[0.06em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300 ${
                    isActive(item.href)
                      ? "text-gold-light after:scale-x-100"
                      : "text-cream/80 after:scale-x-0 hover:text-cream hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-gold hidden !px-5 !py-3 sm:inline-flex">
              <WhatsAppIcon className="h-4 w-4" />
              Atendimento
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-cream xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        className={`fixed inset-x-0 bottom-0 ${scrolled ? "top-[70px]" : "top-[86px]"} overflow-y-auto bg-brown-950 transition-opacity duration-300 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Navegação móvel" className="container-site flex h-full flex-col justify-between py-10">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li key={item.href} style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }} className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between border-b border-white/10 py-4 font-serif text-3xl ${
                    isActive(item.href) ? "text-gold-light" : "text-cream"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-gold w-full">
              <WhatsAppIcon className="h-4 w-4" />
              Iniciar atendimento pelo WhatsApp
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
