import type { Prisma } from "@prisma/client";

export const publishedWhere = (): Prisma.PostWhereInput => ({
  status: "PUBLISHED",
  publishedAt: { lte: new Date() },
});

export type PostState = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export function postState(post: { status: string; publishedAt: Date | null }): PostState {
  if (post.status !== "PUBLISHED") return "DRAFT";
  if (post.publishedAt && post.publishedAt > new Date()) return "SCHEDULED";
  return "PUBLISHED";
}

export const POST_STATE_LABELS: Record<PostState, string> = {
  DRAFT: "Rascunho",
  SCHEDULED: "Agendado",
  PUBLISHED: "Publicado",
};

export const postListInclude = {
  category: { select: { name: true, slug: true } },
  author: { select: { name: true } },
} satisfies Prisma.PostInclude;
