import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Eye } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { siteUrl } from "@/lib/format";
import { POST_STATE_LABELS, postListInclude, postState } from "@/lib/posts";
import { ArticleView } from "@/components/site/ArticleView";

export const metadata: Metadata = { title: "Pré-visualização", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id }, include: postListInclude });
  if (!post) notFound();

  return (
    <>
      <div className="bg-gold text-brown-950">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Eye className="h-4 w-4" /> Pré-visualização — status: {POST_STATE_LABELS[postState(post)]}
          </p>
          <Link href={`/admin/publicacoes/${post.id}`} className="font-bold underline underline-offset-4">
            Voltar ao editor
          </Link>
        </div>
      </div>
      <ArticleView post={{ ...post, publishedAt: post.publishedAt ?? new Date() }} url={siteUrl(`/publicacoes/${post.slug}`)} related={[]} />
    </>
  );
}
