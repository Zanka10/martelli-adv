"use server";

import { createHash, randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  passwordProblem,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";
import { siteUrl } from "@/lib/format";
import type { FormState } from "./types";

// Hash fictício para que a verificação leve o mesmo tempo quando o e-mail não existe.
const DUMMY_HASH = "$2a$12$llv8UfzYsSglj/JJ.dqtYOv77lJ3cX.5KwH5ETp8il9EgOUzIMftq";
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/admin") && !n.startsWith("//") && !n.startsWith("/admin/login") ? n : "/admin";
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 20, 15 * 60_000) || !rateLimit(`login:${email}`, 8, 15 * 60_000)) {
    return { error: "Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente." };
  }

  const user = await db.user.findUnique({ where: { email } });
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { error: "E-mail ou senha incorretos." };
  if (!user.active) return { error: "Este usuário está desativado. Procure um administrador." };

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const done: FormState = {
    ok: "Se o e-mail estiver cadastrado, você receberá em instantes um link para redefinir a senha. O link é válido por 1 hora.",
  };
  if (!email) return { error: "Informe o e-mail cadastrado." };
  if (!rateLimit(`reset:${await clientIp()}`, 5, 60 * 60_000) || !rateLimit(`reset:${email}`, 3, 60 * 60_000)) return done;

  const user = await db.user.findUnique({ where: { email } });
  if (user?.active) {
    const token = randomBytes(32).toString("base64url");
    await db.user.update({
      where: { id: user.id },
      data: { resetTokenHash: sha256(token), resetTokenExpiry: new Date(Date.now() + 60 * 60_000) },
    });
    const link = siteUrl(`/admin/redefinir-senha?token=${token}`);
    await sendMail(
      user.email,
      "Redefinição de senha — painel administrativo",
      `Olá, ${user.name}.\n\nRecebemos uma solicitação para redefinir a sua senha de acesso ao painel.\nPara criar uma nova senha, acesse o link abaixo (válido por 1 hora):\n\n${link}\n\nSe você não fez esta solicitação, ignore este e-mail.`,
    ).catch((e) => console.error("Falha ao enviar e-mail de redefinição:", e));
  }
  return done;
}

export async function resetPassword(_: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!token) return { error: "Link de redefinição inválido." };
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (password !== confirm) return { error: "As senhas não conferem." };

  const user = await db.user.findUnique({ where: { resetTokenHash: sha256(token) } });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return { error: "Este link expirou ou já foi utilizado. Solicite uma nova redefinição." };
  }
  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetTokenHash: null,
      resetTokenExpiry: null,
      sessionVersion: { increment: 1 },
    },
  });
  redirect("/admin/login?redefinida=1");
}

export async function changeOwnPassword(_: FormState, formData: FormData): Promise<FormState> {
  const current = await requireUser();
  const currentPassword = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const user = await db.user.findUniqueOrThrow({ where: { id: current.id } });
  if (!(await verifyPassword(currentPassword, user.passwordHash))) return { error: "A senha atual está incorreta." };
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (password !== confirm) return { error: "As senhas não conferem." };

  // Incrementar a versão encerra as sessões abertas em outros dispositivos.
  const updated = await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password), sessionVersion: { increment: 1 } },
  });
  await createSession(updated);
  return { ok: "Senha alterada com sucesso. As sessões em outros dispositivos foram encerradas." };
}
