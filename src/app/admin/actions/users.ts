"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, passwordProblem, requireAdmin } from "@/lib/auth";
import type { FormState } from "./types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const validRole = (r: string) => (r === "ADMIN" ? "ADMIN" : "EDITOR");

async function otherActiveAdmins(excludeId: string) {
  return db.user.count({ where: { role: "ADMIN", active: true, id: { not: excludeId } } });
}

export async function createUser(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (name.length < 3) return { error: "Informe o nome do usuário." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "Informe um e-mail válido." };
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (await db.user.findUnique({ where: { email } })) return { error: "Já existe um usuário com este e-mail." };

  await db.user.create({ data: { name, email, role: validRole(str(formData, "role")), passwordHash: await hashPassword(password) } });
  return { ok: `Usuário ${name} criado. Informe a senha inicial de forma segura e oriente-o a alterá-la no primeiro acesso.` };
}

export async function updateUser(id: string, formData: FormData) {
  const me = await requireAdmin();
  const role = validRole(str(formData, "role"));
  const active = formData.get("active") === "on";
  const user = await db.user.findUnique({ where: { id } });
  if (!user) redirect("/admin/usuarios");
  // Impede que o painel fique sem nenhum administrador ativo.
  const losingAdmin = user.role === "ADMIN" && (role !== "ADMIN" || !active);
  if (losingAdmin && (await otherActiveAdmins(id)) === 0) redirect("/admin/usuarios?erro=permissao");
  if (id === me.id && !active) redirect("/admin/usuarios?erro=permissao");

  await db.user.update({
    where: { id },
    data: { role, active, ...(active !== user.active || role !== user.role ? { sessionVersion: { increment: 1 } } : {}) },
  });
  redirect("/admin/usuarios?ok=salvo");
}

export async function setUserPassword(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const password = String(formData.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  await db.user.update({ where: { id }, data: { passwordHash: await hashPassword(password), sessionVersion: { increment: 1 } } });
  return { ok: "Senha redefinida. As sessões abertas desse usuário foram encerradas." };
}

export async function deleteUser(id: string) {
  const me = await requireAdmin();
  const user = await db.user.findUnique({ where: { id } });
  if (!user || id === me.id) redirect("/admin/usuarios?erro=permissao");
  if (user.role === "ADMIN" && (await otherActiveAdmins(id)) === 0) redirect("/admin/usuarios?erro=permissao");
  await db.user.delete({ where: { id } });
  redirect("/admin/usuarios?ok=excluido");
}
