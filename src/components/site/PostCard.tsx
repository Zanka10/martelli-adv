/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
  author: { name: string } | null;
};

export function PostCover({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  if (src) return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div aria-hidden className={`texture-dark flex h-full w-full items-center justify-center ${className}`}>
      <span className="arch flex h-2/3 w-1/4 min-w-14 items-end justify-center border border-gold/40 pb-3 font-serif text-3xl text-gold/70">§</span>
    </div>
  );
}

export function PostCard({ post, featured = false }: { post: PostCardData; featured?: boolean }) {
  return (
    <article className="group flex h-full flex-col bg-white transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(59,36,26,0.45)]">
      <Link href={`/publicacoes/${post.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden>
        <div className={`${featured ? "aspect-[16/9]" : "aspect-[3/2]"} overflow-hidden`}>
          <PostCover src={post.coverImage} alt="" className="transition-transform duration-700 group-hover:scale-[1.04]" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
          {post.category && (
            <Link href={`/publicacoes?categoria=${post.category.slug}`} className="text-gold-dark hover:text-brown-700">
              {post.category.name}
            </Link>
          )}
          {post.category && <span className="h-1 w-1 rounded-full bg-line" />}
          <time dateTime={post.publishedAt?.toISOString()} className="text-muted">{formatDate(post.publishedAt)}</time>
        </div>
        <h3 className={`mt-3 text-brown-900 ${featured ? "text-3xl" : "text-2xl"}`}>
          <Link href={`/publicacoes/${post.slug}`} className="transition-colors hover:text-brown-700">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between pt-6">
          {post.author ? <span className="text-xs text-muted">Por {post.author.name}</span> : <span />}
          <span className="link-gold">
            Ler <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
