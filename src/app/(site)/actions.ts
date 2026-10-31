"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type ContactState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

const schema = z.object({
  name: z.string().trim().min(3, "Informe seu nome.").max(120),
  email: z.string().trim().max(160).email("Informe um e-mail válido.").or(z.literal("")),
  phone: z.string().trim().max(30),
  subject: z.string().trim().max(160),
  message: z.string().trim().min(10, "Escreva uma mensagem com pelo menos 10 caracteres.").max(3000),
  privacy: z.literal("on", { errorMap: () => ({ message: "Confirme a leitura do aviso de privacidade." }) }),
});

export async function sendContactMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  // Campo invisível para bloquear envios automatizados.
  if (formData.get("website")) return { ok: true };

  if (!rateLimit(`contact:${await clientIp()}`, 5, 60 * 60 * 1000)) {
    return { error: "Muitas mensagens enviadas em sequência. Tente novamente mais tarde ou utilize o telefone/WhatsApp." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { error: "Revise os campos destacados.", fieldErrors };
  }
  const { name, email, phone, subject, message } = parsed.data;
  if (!email && phone.replace(/\D/g, "").length < 10) {
    return { error: "Informe um e-mail ou telefone para retorno.", fieldErrors: { phone: "Informe um telefone com DDD ou um e-mail." } };
  }

  await db.contactMessage.create({
    data: { name, email: email || null, phone: phone || null, subject: subject || null, message },
  });
  return { ok: true };
}
