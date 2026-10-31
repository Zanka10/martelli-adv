import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Nova publicação" };

export default async function NewPostPage() {
  const [categories, authors] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.teamMember.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  return (
    <>
      <Link href="/admin/publicacoes" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-brown-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Publicações
      </Link>
      <AdminPageHeader title="Nova publicação" />
      <PostForm
        categories={categories}
        authors={authors}
        post={{ title: "", subtitle: "", slug: "", excerpt: "", content: "", coverImage: "", categoryId: "", authorId: "", seoTitle: "", seoDescription: "", state: "DRAFT", publishedAt: null }}
      />
    </>
  );
}
