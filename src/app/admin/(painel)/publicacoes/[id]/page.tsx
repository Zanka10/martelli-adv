import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { POST_STATE_LABELS, postState } from "@/lib/posts";
import { deletePost } from "../../../actions/posts";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmSubmit } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Editar publicação" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories, authors] = await Promise.all([
    db.post.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.teamMember.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  if (!post) notFound();
  const state = postState(post);

  return (
    <>
      <Link href="/admin/publicacoes" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-brown-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Publicações
      </Link>
      <AdminPageHeader
        title="Editar publicação"
        description={state === "SCHEDULED" ? `Agendada para ${formatDate(post.publishedAt, true)}` : undefined}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge state={state} label={POST_STATE_LABELS[state]} />
            <form action={deletePost.bind(null, post.id)}>
              <ConfirmSubmit message={`Excluir definitivamente “${post.title}”?`} className="btn !border-[#e3b3a5] !py-2.5 text-[#a2391f] hover:bg-[#fbf0ec]">
                <Trash2 className="h-4 w-4" /> Excluir
              </ConfirmSubmit>
            </form>
          </div>
        }
      />
      <PostForm
        key={post.updatedAt.toISOString()}
        categories={categories}
        authors={authors}
        meta={{
          createdAt: formatDate(post.createdAt, true),
          updatedAt: formatDate(post.updatedAt, true),
          publicUrl: state === "PUBLISHED" ? `/publicacoes/${post.slug}` : null,
        }}
        post={{
          id: post.id,
          title: post.title,
          subtitle: post.subtitle ?? "",
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          categoryId: post.categoryId ?? "",
          authorId: post.authorId ?? "",
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          state,
          publishedAt: post.publishedAt?.toISOString() ?? null,
        }}
      />
    </>
  );
}
