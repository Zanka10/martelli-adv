import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o escritório trata os dados pessoais informados neste site.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default async function PrivacyPage() {
  const s = await getSettings();
  // Linhas curtas sem ponto final são tratadas como subtítulos.
  const blocks = s.privacyNotice.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  return (
    <>
      <PageHeader eyebrow="Privacidade" title="Política de Privacidade" crumbs={[{ label: "Política de Privacidade" }]} />
      <section className="py-14 md:py-20">
        <div className="container-site max-w-3xl">
          <div className="rich-text">
            {blocks.map((b, i) => (b.length < 60 && !/[.:;]$/.test(b) ? <h2 key={i}>{b}</h2> : <p key={i}>{b}</p>))}
          </div>
        </div>
      </section>
    </>
  );
}
