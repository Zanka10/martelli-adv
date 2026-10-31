"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { sanitizeRichText } from "@/lib/sanitize";
import { slugify, uniqueSlug } from "@/lib/slug";
import { isAllowedImageUrl } from "@/lib/uploads";
import { AREA_ICONS } from "@/components/icons";
import type { FormState } from "./types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const bool = (fd: FormData, k: string) => fd.get(k) === "on";

function fail(error: z.ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const i of error.issues) fieldErrors[String(i.path[0])] ??= i.message;
  return { error: "Revise os campos destacados.", fieldErrors };
}

/* ───────────── Áreas de atuação ───────────── */

const areaSchema = z.object({
  title: z.string().trim().min(2, "Informe o nome do serviço.").max(120),
  slug: z.string().trim().max(120),
  icon: z.string().refine((v) => v in AREA_ICONS, "Ícone inválido."),
  image: z.string().trim().refine(isAllowedImageUrl, "Imagem inválida."),
  summary: z.string().trim().min(10, "Escreva um resumo com pelo menos 10 caracteres.").max(400),
  description: z.string().max(200_000),
  situations: z.string().max(5_000),
  complementary: z.string().max(5_000),
  order: z.coerce.number().int().min(0).max(9999),
});

export async function saveArea(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const id = str(formData, "id") || null;
  const parsed = areaSchema.safeParse(Object.fromEntries(areaSchema.keyof().options.map((k) => [k, str(formData, k)])));
  if (!parsed.success) return fail(parsed.error);
  const d = parsed.data;
  const slug = await uniqueSlug(d.slug ? slugify(d.slug) : d.title, async (s) => {
    const found = await db.practiceArea.findUnique({ where: { slug: s }, select: { id: true } });
    return Boolean(found && found.id !== id);
  });
  const data = {
    ...d,
    slug,
    image: d.image || null,
    description: sanitizeRichText(d.description),
    active: bool(formData, "active"),
    showInQuoteForm: bool(formData, "showInQuoteForm"),
  };
  if (id) await db.practiceArea.update({ where: { id }, data });
  else await db.practiceArea.create({ data });
  redirect(`/admin/areas?ok=${id ? "salvo" : "criado"}`);
}

export async function toggleAreaFlag(id: string, flag: "active" | "showInQuoteForm") {
  await requireUser();
  const area = await db.practiceArea.findUnique({ where: { id } });
  if (area) await db.practiceArea.update({ where: { id }, data: { [flag]: !area[flag] } });
  redirect("/admin/areas?ok=salvo");
}

export async function moveArea(id: string, direction: "up" | "down") {
  await requireUser();
  const areas = await db.practiceArea.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }], select: { id: true } });
  const i = areas.findIndex((a) => a.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i >= 0 && j >= 0 && j < areas.length) {
    [areas[i], areas[j]] = [areas[j], areas[i]];
    await db.$transaction(areas.map((a, idx) => db.practiceArea.update({ where: { id: a.id }, data: { order: idx } })));
  }
  redirect("/admin/areas");
}

export async function deleteArea(id: string) {
  await requireUser();
  await db.practiceArea.delete({ where: { id } }).catch(() => null);
  redirect("/admin/areas?ok=excluido");
}

/* ───────────── Equipe ───────────── */

const memberSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo.").max(120),
  role: z.string().trim().max(120),
  oab: z.string().trim().max(40),
  bio: z.string().trim().max(3_000),
  photo: z.string().trim().refine(isAllowedImageUrl, "Foto inválida."),
  order: z.coerce.number().int().min(0).max(9999),
});

export async function saveMember(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const id = str(formData, "id") || null;
  const parsed = memberSchema.safeParse(Object.fromEntries(memberSchema.keyof().options.map((k) => [k, str(formData, k)])));
  if (!parsed.success) return fail(parsed.error);
  const d = parsed.data;
  const oabVerified = bool(formData, "oabVerified");
  if (oabVerified && !d.oab) return { error: "Informe o número da OAB ou desmarque a confirmação.", fieldErrors: { oab: "Informe o número da inscrição." } };

  const areaIds = formData.getAll("areas").map(String);
  const validAreas = await db.practiceArea.findMany({ where: { id: { in: areaIds } }, select: { id: true } });
  const data = {
    ...d,
    oab: d.oab || null,
    oabVerified,
    photo: d.photo || null,
    published: bool(formData, "published"),
  };
  if (id) {
    await db.teamMember.update({ where: { id }, data: { ...data, areas: { set: validAreas } } });
  } else {
    await db.teamMember.create({ data: { ...data, areas: { connect: validAreas } } });
  }
  redirect(`/admin/equipe?ok=${id ? "salvo" : "criado"}`);
}

export async function toggleMemberPublished(id: string) {
  await requireUser();
  const m = await db.teamMember.findUnique({ where: { id } });
  if (m) await db.teamMember.update({ where: { id }, data: { published: !m.published } });
  redirect("/admin/equipe?ok=salvo");
}

export async function deleteMember(id: string) {
  await requireUser();
  await db.teamMember.delete({ where: { id } }).catch(() => null);
  redirect("/admin/equipe?ok=excluido");
}

/* ───────────── Mensagens de contato ───────────── */

export async function toggleMessageRead(id: string) {
  await requireUser();
  const m = await db.contactMessage.findUnique({ where: { id } });
  if (m) await db.contactMessage.update({ where: { id }, data: { read: !m.read } });
  redirect("/admin/mensagens");
}

export async function deleteMessage(id: string) {
  await requireUser();
  await db.contactMessage.delete({ where: { id } }).catch(() => null);
  redirect("/admin/mensagens?ok=excluido");
}
