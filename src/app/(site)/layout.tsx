import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/format";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppIcon } from "@/components/site/SocialIcons";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, areas] = await Promise.all([
    getSettings(),
    db.practiceArea.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { title: "asc" }], select: { title: true, slug: true } }),
  ]);
  const wa = whatsappLink(settings.whatsapp, settings.whatsappDefaultMessage);

  return (
    <>
      <a href="#conteudo" className="sr-only z-[60] bg-gold px-4 py-2 text-brown-950 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Pular para o conteúdo
      </a>
      <Header officeName={settings.officeName} logo={settings.logo} whatsappHref={wa} />
      <main id="conteudo">{children}</main>
      <Footer settings={settings} areas={areas} />
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar pelo WhatsApp"
          className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-brown-950 shadow-[0_14px_30px_-10px_rgba(59,36,26,0.65)] transition-transform hover:scale-105 sm:hidden"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
      )}
    </>
  );
}
