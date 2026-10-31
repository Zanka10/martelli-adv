import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/format";
import { postListInclude, publishedWhere } from "@/lib/posts";
import { ArticleView } from "@/components/site/ArticleView";

type Props = { params: Promise<{ slug: string }> };

const getPost = (slug: string) => db.post.findFirst({ where: { slug, ...publishedWhere() }, include: postListInclude });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || post.subtitle || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/publicacoes/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author.name] : undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [s, related] = await Promise.all([
    getSettings(),
    db.post.findMany({
      where: { ...publishedWhere(), id: { not: post.id }, ...(post.categoryId ? { categoryId: post.categoryId } : {}) },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: postListInclude,
    }),
  ]);
  const url = siteUrl(`/publicacoes/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: post.coverImage ? [post.coverImage.startsWith("/") ? siteUrl(post.coverImage) : post.coverImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author ? { "@type": "Person", name: post.author.name } : { "@type": "Organization", name: s.officeName },
    publisher: { "@type": "LegalService", name: s.officeName },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ArticleView post={post} url={url} related={related} />
    </>
  );
}
