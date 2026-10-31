import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { POST_STATE_LABELS, postState } from "@/lib/posts";
import { deletePost, togglePublish } from "../../actions/posts";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmSubmit } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Publicações" };

const PAGE_SIZE = 20;

type Props = { searchParams: Promise<{ q?: string; status?: string; categoria?: string; pagina?: string }> };

export default async function AdminPostsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const status = sp.status ?? "";
  const categoria = sp.categoria ?? "";
  const page = Math.max(1, Number(sp.pagina) || 1);
  const now = new Date();

  const where: Prisma.PostWhereInput = {
    ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }, { content: { contains: q } }] } : {}),
    ...(categoria ? { categoryId: categoria } : {}),
    ...(status === "DRAFT" ? { status: "DRAFT" } : {}),
    ...(status === "PUBLISHED" ? { status: "PUBLISHED", publishedAt: { lte: now } } : {}),
    ...(status === "SCHEDULED" ? { status: "PUBLISHED", publishedAt: { gt: now } } : {}),
  };

  const [posts, total, categories] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true } }, author: { select: { name: true } } },
    }),
    db.post.count({ where }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  const pages = Math.ceil(total / PAGE_SIZE);
  const qs = (p: number) => {
    const u = new URLSearchParams({ ...(q && { q }), ...(status && { status }), ...(categoria && { categoria }), pagina: String(p) });
    return `/admin/publicacoes?${u}`;
  };

  return (
    <>
      <AdminPageHeader
        title="Publicações"
        description={`${total} ${total === 1 ? "publicação encontrada" : "publicações encontradas"}`}
        actions={
          <Link href="/admin/publicacoes/nova" className="btn btn-gold !py-3">
            <Plus className="h-4 w-4" /> Nova publicação
          </Link>
        }
      />

      <form className="mb-6 grid gap-3 bg-white p-4 sm:grid-cols-[1fr_11rem_11rem_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={q} placeholder="Pesquisar por título ou conteúdo" aria-label="Pesquisar" className="field !pl-9" />
        </div>
        <select name="status" defaultValue={status} aria-label="Filtrar por status" className="field">
          <option value="">Todos os status</option>
          <option value="PUBLISHED">Publicados</option>
          <option value="SCHEDULED">Agendados</option>
          <option value="DRAFT">Rascunhos</option>
        </select>
        <select name="categoria" defaultValue={categoria} aria-label="Filtrar por categoria" className="field">
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-dark !py-3">Filtrar</button>
      </form>

      {posts.length === 0 ? (
        <div className="bg-white p-12 text-center">
          <p className="text-muted">Nenhuma publicação encontrada.</p>
          <Link href="/admin/publicacoes/nova" className="link-gold mt-4">Criar a primeira publicação</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-line text-left text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Título</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Publicação</th>
                <th className="px-3 py-3 font-semibold">Criada / Atualizada</th>
                <th className="px-5 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {posts.map((p) => {
                const state = postState(p);
                return (
                  <tr key={p.id} className="align-top hover:bg-cream/60">
                    <td className="px-5 py-4">
                      <Link href={`/admin/publicacoes/${p.id}`} className="font-semibold text-brown-900 hover:text-gold-dark">
                        {p.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {[p.category?.name, p.author?.name].filter(Boolean).join(" · ") || "Sem categoria"}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge state={state} label={POST_STATE_LABELS[state]} />
                    </td>
                    <td className="px-3 py-4 text-xs text-muted">{p.publishedAt ? formatDate(p.publishedAt, true) : "—"}</td>
                    <td className="px-3 py-4 text-xs text-muted">
                      {formatDate(p.createdAt, true)}
                      <br />
                      {formatDate(p.updatedAt, true)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <form action={togglePublish.bind(null, p.id)}>
                          <button type="submit" className="mr-2 text-xs font-semibold text-brown-700 hover:text-gold-dark">
                            {p.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                          </button>
                        </form>
                        <Link href={`/previa/${p.id}`} target="_blank" title="Pré-visualizar" aria-label="Pré-visualizar" className="flex h-8 w-8 items-center justify-center text-brown-700 hover:text-gold-dark">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/publicacoes/${p.id}`} title="Editar" aria-label="Editar" className="flex h-8 w-8 items-center justify-center text-brown-700 hover:text-gold-dark">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={deletePost.bind(null, p.id)}>
                          <ConfirmSubmit message={`Excluir definitivamente “${p.title}”? Esta ação não pode ser desfeita.`} className="flex h-8 w-8 items-center justify-center text-[#a2391f] hover:text-[#7d2d18]">
                            <Trash2 className="h-4 w-4" aria-label="Excluir" />
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav className="mt-6 flex justify-center gap-2" aria-label="Paginação">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={qs(n)} aria-current={n === page ? "page" : undefined} className={`flex h-9 w-9 items-center justify-center text-sm ${n === page ? "bg-brown-900 text-cream" : "bg-white text-brown-900"}`}>
              {n}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
