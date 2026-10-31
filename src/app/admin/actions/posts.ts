"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { sanitizeRichText, stripHtml } from "@/lib/sanitize";
import { slugify, uniqueSlug } from "@/lib/slug";
import { isAllowedImageUrl } from "@/lib/uploads";
import type { FormState } from "./types";

const schema = z.object({
  title: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres.").max(200),
  subtitle: z.string().trim().max(300),
  slug: z.string().trim().max(120),
  excerpt: z.string().trim().max(500, "O resumo deve ter no máximo 500 caracteres."),
  content: z.string().max(500_000),
  coverImage: z.string().trim().refine(isAllowedImageUrl, "Imagem de capa inválida."),
  categoryId: z.string(),
  authorId: z.string(),
  seoTitle: z.string().trim().max(70, "O título SEO deve ter no máximo 70 caracteres."),
  seoDescription: z.string().trim().max(170, "A descrição SEO deve ter no máximo 170 caracteres."),
  mode: z.enum(["draft", "publish", "schedule"]),
  scheduledAt: z.string(),
});

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

export async function savePost(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const id = str(formData, "id") || null;
  const parsed = schema.safeParse(Object.fromEntries(schema.keyof().options.map((k) => [k, str(formData, k)])));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: "Revise os campos destacados.", fieldErrors };
  }
  const d = parsed.data;
  const content = sanitizeRichText(d.content);
  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  if (id && !existing) return { error: "Publicação não encontrada." };

  let status = "DRAFT";
  let publishedAt: Date | null = null;
  if (d.mode === "publish") {
    if (!stripHtml(content)) return { error: "Escreva o conteúdo antes de publicar.", fieldErrors: { content: "O conteúdo não pode ficar vazio." } };
    status = "PUBLISHED";
    // Mantém a data original se o artigo já estava no ar.
    publishedAt = existing?.status === "PUBLISHED" && existing.publishedAt && existing.publishedAt <= new Date() ? existing.publishedAt : new Date();
  } else if (d.mode === "schedule") {
    const when = new Date(d.scheduledAt);
    if (Number.isNaN(when.getTime()) || when <= new Date()) {
      return { error: "Informe uma data futura para o agendamento.", fieldErrors: { scheduledAt: "Escolha uma data e hora no futuro." } };
    }
    if (!stripHtml(content)) return { error: "Escreva o conteúdo antes de agendar.", fieldErrors: { content: "O conteúdo não pode ficar vazio." } };
    status = "PUBLISHED";
    publishedAt = when;
  }

  const slug = await uniqueSlug(d.slug ? slugify(d.slug) : d.title, async (s) => {
    const found = await db.post.findUnique({ where: { slug: s }, select: { id: true } });
    return Boolean(found && found.id !== id);
  });

  const [category, author] = await Promise.all([
    d.categoryId ? db.category.findUnique({ where: { id: d.categoryId }, select: { id: true } }) : null,
    d.authorId ? db.teamMember.findUnique({ where: { id: d.authorId }, select: { id: true } }) : null,
  ]);

  const data = {
    title: d.title,
    subtitle: d.subtitle || null,
    slug,
    excerpt: d.excerpt || stripHtml(content).slice(0, 220) || null,
    content,
    coverImage: d.coverImage || null,
    categoryId: category?.id ?? null,
    authorId: author?.id ?? null,
    seoTitle: d.seoTitle || null,
    seoDescription: d.seoDescription || null,
    status,
    publishedAt,
  };

  const post = id ? await db.post.update({ where: { id }, data }) : await db.post.create({ data });

  if (str(formData, "intent") === "preview") redirect(`/previa/${post.id}`);
  redirect(`/admin/publicacoes/${post.id}?ok=${id ? "salvo" : "criado"}`);
}

export async function togglePublish(id: string) {
  await requireUser();
  const post = await db.post.findUnique({ where: { id } });
  if (!post) redirect("/admin/publicacoes");
  const publish = post.status !== "PUBLISHED";
  if (publish && !stripHtml(post.content)) redirect(`/admin/publicacoes/${id}`);
  await db.post.update({
    where: { id },
    data: publish ? { status: "PUBLISHED", publishedAt: new Date() } : { status: "DRAFT", publishedAt: null },
  });
  redirect(`/admin/publicacoes?ok=${publish ? "publicado" : "despublicado"}`);
}

export async function deletePost(id: string) {
  await requireUser();
  await db.post.delete({ where: { id } }).catch(() => null);
  redirect("/admin/publicacoes?ok=excluido");
}

export async function createCategory(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const name = str(formData, "name").trim();
  if (name.length < 2 || name.length > 60) return { error: "Informe um nome entre 2 e 60 caracteres." };
  const slug = await uniqueSlug(name, async (s) => Boolean(await db.category.findUnique({ where: { slug: s } })));
  await db.category.create({ data: { name, slug } });
  return { ok: `Categoria “${name}” criada.` };
}

export async function renameCategory(id: string, formData: FormData) {
  await requireUser();
  const name = str(formData, "name").trim();
  if (name.length >= 2 && name.length <= 60) await db.category.update({ where: { id }, data: { name } });
  redirect("/admin/categorias?ok=salvo");
}

export async function deleteCategory(id: string) {
  await requireUser();
  await db.category.delete({ where: { id } }).catch(() => null);
  redirect("/admin/categorias?ok=excluido");
}
