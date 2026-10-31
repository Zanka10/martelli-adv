import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "./SocialIcons";

type Props = { title: string; text: string; whatsappHref?: string | null; quoteHref?: string };

export function CtaBand({ title, text, whatsappHref, quoteHref = "/solicitar-orcamento" }: Props) {
  return (
    <section className="py-16 md:py-20">
      <div className="container-site">
        <div className="texture-dark relative overflow-hidden px-8 py-12 md:px-14 md:py-14">
          <div aria-hidden className="arch pointer-events-none absolute -right-16 -bottom-40 h-80 w-56 border border-gold/20" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl text-cream md:text-4xl">{title}</h2>
              <p className="mt-3 leading-relaxed text-cream/70">{text}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href={quoteHref} className="btn btn-gold">
                Solicitar orçamento <ArrowRight className="h-4 w-4" />
              </Link>
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
