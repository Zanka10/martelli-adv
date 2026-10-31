import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { deleteCategory, renameCategory } from "../../actions/posts";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ui";
import { NewCategoryForm } from "./NewCategoryForm";

export const metadata: Metadata = { title: "Categorias" };

export default async function CategoriesPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } });
  return (
    <>
      <AdminPageHeader title="Categorias" description="Organize as publicações por assunto. Elas aparecem como filtros na página de publicações." />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="bg-white">
          {categories.length === 0 ? (
            <p className="p-8 text-sm text-muted">Nenhuma categoria cadastrada.</p>
          ) : (
            <ul className="divide-y divide-line">
              {categories.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 p-4">
                  <form action={renameCategory.bind(null, c.id)} className="flex flex-1 items-center gap-2">
                    <input name="name" defaultValue={c.name} aria-label="Nome da categoria" className="field !py-2" />
                    <button type="submit" className="btn btn-outline !px-4 !py-2">Salvar</button>
                  </form>
                  <span className="w-24 text-xs text-muted">{c._count.posts} {c._count.posts === 1 ? "publicação" : "publicações"}</span>
                  <form action={deleteCategory.bind(null, c.id)}>
                    <ConfirmSubmit message={`Excluir a categoria “${c.name}”? As publicações ficarão sem categoria.`} className="flex h-9 w-9 items-center justify-center text-[#a2391f]">
                      <Trash2 className="h-4 w-4" aria-label="Excluir" />
                    </ConfirmSubmit>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
        <NewCategoryForm />
      </div>
    </>
  );
}
