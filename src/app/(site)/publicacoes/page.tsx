import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { db } from "@/lib/db";
import { postListInclude, publishedWhere } from "@/lib/posts";
import { PageHeader } from "@/components/site/PageHeader";
import { PostCard } from "@/components/site/PostCard";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Publicações",
  description: "Artigos, notícias e conteúdos jurídicos publicados pelo escritório.",
  alternates: { canonical: "/publicacoes" },
};

const PAGE_SIZE = 9;

type Props = { searchParams: Promise<{ q?: string; categoria?: string; pagina?: string }> };

export default async function PostsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const categorySlug = sp.categoria ?? "";
  const page = Math.max(1, Number.parseInt(sp.pagina ?? "1", 10) || 1);

  const where: Prisma.PostWhereInput = {
    ...publishedWhere(),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }, { subtitle: { contains: q } }, { content: { contains: q } }] } : {}),
  };

  const [categories, total, posts, recent] = await Promise.all([
    db.category.findMany({ where: { posts: { some: publishedWhere() } }, orderBy: { name: "asc" } }),
    db.post.count({ where }),
    db.post.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: postListInclude }),
    db.post.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" }, take: 4, select: { slug: true, title: true, publishedAt: true } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtering = Boolean(q || categorySlug);
  const showFeatured = !filtering && page === 1 && posts.length > 0;
  const [featured, ...rest] = showFeatured ? posts : [null, ...posts];

  const href = (params: { q?: string; categoria?: string; pagina?: number }) => {
    const u = new URLSearchParams();
    if (params.q) u.set("q", params.q);
    if (params.categoria) u.set("categoria", params.categoria);
    if (params.pagina && params.pagina > 1) u.set("pagina", String(params.pagina));
    const s = u.toString();
    return `/publicacoes${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        eyebrow="Publicações"
        title="Artigos e conteúdos jurídicos"
        text="Informação jurídica clara e atualizada, preparada pela equipe do escritório."
        crumbs={[{ label: "Publicações" }]}
      />

      <section className="border-b border-line bg-white">
        <div className="container-site flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Filtrar por categoria" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <Link
              href={href({ q })}
              className={`shrink-0 border px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                !categorySlug ? "border-brown-900 bg-brown-900 text-cream" : "border-line text-brown-700 hover:border-gold"
              }`}
            >
              Todas
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={href({ q, categoria: c.slug })}
                className={`shrink-0 border px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                  categorySlug === c.slug ? "border-brown-900 bg-brown-900 text-cream" : "border-line text-brown-700 hover:border-gold"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <form action="/publicacoes" role="search" className="relative w-full lg:w-80">
            {categorySlug && <input type="hidden" name="categoria" value={categorySlug} />}
            <label htmlFor="busca" className="sr-only">Pesquisar publicações</label>
            <input id="busca" name="q" defaultValue={q} placeholder="Pesquisar por título ou palavra-chave" className="field !pr-11" />
            <button type="submit" aria-label="Pesquisar" className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-brown-700 hover:text-gold-dark">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-site">
          {filtering && (
            <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>
                {total} {total === 1 ? "resultado" : "resultados"}
                {q && (
                  <>
                    {" "}para <strong className="text-brown-900">“{q}”</strong>
                  </>
                )}
                {categorySlug && categories.find((c) => c.slug === categorySlug) && (
                  <>
                    {" "}em <strong className="text-brown-900">{categories.find((c) => c.slug === categorySlug)?.name}</strong>
                  </>
                )}
              </span>
              <Link href="/publicacoes" className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.1em] text-brown-700 uppercase hover:text-gold-dark">
                <X className="h-3.5 w-3.5" /> Limpar filtros
              </Link>
            </div>
          )}

          {total === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <span className="gold-rule mx-auto block" />
              <h2 className="mt-6 text-3xl text-brown-900">{filtering ? "Nenhuma publicação encontrada" : "Em breve, novas publicações"}</h2>
              <p className="mt-3 text-muted">
                {filtering ? "Tente pesquisar por outros termos ou remova os filtros." : "Os conteúdos do escritório serão publicados aqui."}
              </p>
            </div>
          ) : (
            <div className={showFeatured ? "grid gap-12 lg:grid-cols-[1fr_20rem]" : ""}>
              <div>
                {featured && (
                  <Reveal className="mb-12">
                    <PostCard post={featured} featured />
                  </Reveal>
                )}
                <div className={`grid gap-8 md:grid-cols-2 ${showFeatured ? "" : "lg:grid-cols-3"}`}>
                  {rest.map((post, i) => post && (
                    <Reveal key={post.id} delay={(i % 3) * 80}>
                      <PostCard post={post} />
                    </Reveal>
                  ))}
                </div>
              </div>
              {showFeatured && (
                <aside className="lg:sticky lg:top-28 lg:self-start">
                  <div className="border border-line bg-white p-7">
                    <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">Mais recentes</h2>
                    <ol className="mt-5 space-y-5">
                      {recent.map((r, i) => (
                        <li key={r.slug} className="flex gap-4">
                          <span className="font-serif text-2xl leading-none text-gold">{i + 1}</span>
                          <Link href={`/publicacoes/${r.slug}`} className="font-serif text-lg leading-snug text-brown-900 hover:text-brown-700">
                            {r.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                </aside>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Paginação" className="mt-16 flex items-center justify-center gap-2">
              {page > 1 ? (
                <Link href={href({ q, categoria: categorySlug, pagina: page - 1 })} className="flex h-11 w-11 items-center justify-center border border-line bg-white hover:border-gold" aria-label="Página anterior">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : null}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .map((n, i, arr) => (
                  <span key={n} className="flex items-center gap-2">
                    {i > 0 && n - arr[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
                    <Link
                      href={href({ q, categoria: categorySlug, pagina: n })}
                      aria-current={n === page ? "page" : undefined}
                      className={`flex h-11 w-11 items-center justify-center border text-sm font-semibold ${
                        n === page ? "border-brown-900 bg-brown-900 text-cream" : "border-line bg-white text-brown-900 hover:border-gold"
                      }`}
                    >
                      {n}
                    </Link>
                  </span>
                ))}
              {page < totalPages ? (
                <Link href={href({ q, categoria: categorySlug, pagina: page + 1 })} className="flex h-11 w-11 items-center justify-center border border-line bg-white hover:border-gold" aria-label="Próxima página">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
