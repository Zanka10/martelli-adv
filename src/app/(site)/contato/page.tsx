import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { formatPhone, lines, telLink, whatsappLink } from "@/lib/format";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { WhatsAppIcon, socialLinks } from "@/components/site/SocialIcons";

export const metadata: Metadata = {
  title: "Contato",
  description: "Telefone, WhatsApp, e-mail, endereço e horário de atendimento do escritório.",
  alternates: { canonical: "/contato" },
};

export default async function ContactPage() {
  const s = await getSettings();
  const wa = whatsappLink(s.whatsapp, s.whatsappDefaultMessage);
  const social = socialLinks(s);
  const mapSrc = s.mapEmbedUrl.startsWith("https://www.google.com/maps/embed")
    ? s.mapEmbedUrl
    : s.address
      ? `https://www.google.com/maps?q=${encodeURIComponent(s.address.replace(/\n/g, ", "))}&output=embed`
      : null;

  const channels = [
    s.phone && { icon: <Phone className="h-5 w-5" strokeWidth={1.5} />, label: "Telefone", value: formatPhone(s.phone), href: telLink(s.phone) },
    wa && { icon: <WhatsAppIcon className="h-5 w-5" />, label: "WhatsApp", value: formatPhone(s.whatsapp), href: wa, external: true },
    s.email && { icon: <Mail className="h-5 w-5" strokeWidth={1.5} />, label: "E-mail", value: s.email, href: `mailto:${s.email}` },
    s.address && { icon: <MapPin className="h-5 w-5" strokeWidth={1.5} />, label: "Endereço", value: s.address },
    s.businessHours && { icon: <Clock className="h-5 w-5" strokeWidth={1.5} />, label: "Horário de atendimento", value: lines(s.businessHours).join("\n") },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string; external?: boolean }[];

  return (
    <>
      <PageHeader
        eyebrow="Contato"
        title="Fale com o escritório"
        text="Escolha o canal de sua preferência ou envie uma mensagem pelo formulário. Retornaremos o contato assim que possível."
        crumbs={[{ label: "Contato" }]}
      />

      <section className="py-14 md:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-3xl text-brown-900 md:text-4xl">Canais de atendimento</h2>
            {channels.length === 0 ? (
              <p className="mt-6 text-muted">Os canais de atendimento serão divulgados em breve. Utilize o formulário ao lado.</p>
            ) : (
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {channels.map((c) => (
                  <li key={c.label} className="flex gap-5 py-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brown-900 text-gold">{c.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-[0.16em] text-muted uppercase">{c.label}</p>
                      {c.href ? (
                        <a
                          href={c.href}
                          {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="mt-1 block break-words text-lg text-brown-900 hover:text-gold-dark"
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-lg whitespace-pre-line text-brown-900">{c.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {social.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold tracking-[0.16em] text-muted uppercase">Redes sociais</p>
                <ul className="mt-3 flex gap-3">
                  {social.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-brown-700 transition-colors hover:border-gold hover:text-gold-dark"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white p-6 shadow-[0_30px_60px_-40px_rgba(59,36,26,0.35)] sm:p-10">
            <h2 className="text-3xl text-brown-900">Envie uma mensagem</h2>
            <p className="mt-2 mb-8 text-sm text-muted">Campos marcados com * são obrigatórios.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {mapSrc && (
        <section aria-label="Mapa de localização" className="h-[420px] bg-sand">
          <iframe
            src={mapSrc}
            title={`Mapa de localização de ${s.officeName}`}
            className="h-full w-full border-0 grayscale-[35%] sepia-[20%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}
    </>
  );
}
