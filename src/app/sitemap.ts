import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/format";
import { publishedWhere } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, areas] = await Promise.all([
    db.post.findMany({ where: publishedWhere(), select: { slug: true, updatedAt: true } }),
    db.practiceArea.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const pages = ["", "/o-escritorio", "/areas-de-atuacao", "/publicacoes", "/solicitar-orcamento", "/contato", "/politica-de-privacidade"];
  return [
    ...pages.map((p) => ({ url: siteUrl(p), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...areas.map((a) => ({ url: siteUrl(`/areas-de-atuacao/${a.slug}`), lastModified: a.updatedAt, priority: 0.8 })),
    ...posts.map((p) => ({ url: siteUrl(`/publicacoes/${p.slug}`), lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
