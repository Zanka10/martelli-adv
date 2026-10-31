import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  text?: string;
  crumbs?: { href?: string; label: string }[];
};

export function PageHeader({ eyebrow, title, text, crumbs = [] }: Props) {
  return (
    <section className="texture-dark relative overflow-hidden">
      <div aria-hidden className="arch pointer-events-none absolute -right-24 -bottom-40 hidden h-[30rem] w-[20rem] border border-gold/20 md:block" />
      <div aria-hidden className="arch pointer-events-none absolute -right-10 -bottom-48 hidden h-[30rem] w-[20rem] border border-gold/10 md:block" />
      <div className="container-site relative py-16 md:py-24">
        <nav aria-label="Trilha de navegação" className="mb-8 animate-fade-up">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-cream/55">
            <li>
              <Link href="/" className="hover:text-gold-light">Início</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                {c.href ? <Link href={c.href} className="hover:text-gold-light">{c.label}</Link> : <span aria-current="page" className="text-cream/80">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow eyebrow-light animate-fade-up">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl animate-fade-up text-4xl text-cream md:text-6xl [animation-delay:80ms]">{title}</h1>
        {text && <p className="mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-cream/70 md:text-lg [animation-delay:160ms]">{text}</p>}
      </div>
    </section>
  );
}
