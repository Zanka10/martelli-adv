/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { ShareButtons } from "./ShareButtons";
import { PostCard, type PostCardData } from "./PostCard";

type Article = PostCardData & {
  subtitle: string | null;
  content: string;
  updatedAt: Date;
};

export function ArticleView({ post, url, related }: { post: Article; url: string; related: PostCardData[] }) {
  return (
    <article>
      <header className="texture-dark">
        <div className="container-site max-w-4xl py-14 md:py-20">
          <Link href="/publicacoes" className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-cream/60 uppercase hover:text-gold-light">
            <ArrowLeft className="h-3.5 w-3.5" /> Publicações
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] font-bold tracking-[0.16em] uppercase">
            {post.category && (
              <Link href={`/publicacoes?categoria=${post.category.slug}`} className="text-gold hover:text-gold-light">
                {post.category.name}
              </Link>
            )}
            {post.category && <span className="h-1 w-1 rounded-full bg-cream/30" />}
            <time dateTime={post.publishedAt?.toISOString()} className="text-cream/60">{formatDate(post.publishedAt)}</time>
          </div>
          <h1 className="mt-5 animate-fade-up text-4xl leading-[1.08] text-cream md:text-6xl">{post.title}</h1>
          {post.subtitle && <p className="mt-6 animate-fade-up font-serif text-xl leading-snug text-cream/75 italic md:text-2xl">{post.subtitle}</p>}
          {post.author && (
            <p className="mt-8 text-sm text-cream/70">
              Por <span className="font-semibold text-cream">{post.author.name}</span>
            </p>
          )}
        </div>
      </header>

      {post.coverImage && (
        <div className="container-site max-w-5xl">
          <div className="-mt-px aspect-[16/8] overflow-hidden md:-mt-0">
            <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      <div className="container-site max-w-3xl py-14 md:py-20">
        {post.excerpt && <p className="mb-10 border-l-2 border-gold pl-6 text-lg leading-relaxed text-brown-700">{post.excerpt}</p>}
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ShareButtons url={url} title={post.title} />
          <p className="text-xs text-muted">Atualizado em {formatDate(post.updatedAt)}</p>
        </div>

        <aside className="mt-12 bg-sand p-8">
          <p className="text-sm leading-relaxed text-ink/80">
            Este conteúdo tem caráter informativo e não substitui a análise individual de um advogado. Para avaliar o seu caso,
            entre em contato com o escritório.
          </p>
          <Link href="/solicitar-orcamento" className="link-gold mt-5">
            Solicitar atendimento <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-16 md:py-20">
          <div className="container-site">
            <h2 className="text-3xl text-brown-900 md:text-4xl">Leia também</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
