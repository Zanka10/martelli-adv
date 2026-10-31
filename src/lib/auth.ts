import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session-token";

export type Role = "ADMIN" | "EDITOR";
export const ROLE_LABELS: Record<Role, string> = { ADMIN: "Administrador", EDITOR: "Editor" };

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export function passwordProblem(password: string): string | null {
  if (password.length < 10) return "A senha deve ter pelo menos 10 caracteres.";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return "A senha deve conter letras e números.";
  return null;
}

export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.uid },
    select: { id: true, name: true, email: true, role: true, active: true, sessionVersion: true },
  });
  if (!user || !user.active || user.sessionVersion !== session.v) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/admin?erro=permissao");
  return user;
}

export async function createSession(user: { id: string; sessionVersion: number }) {
  const token = await signSession({ uid: user.id, v: user.sessionVersion });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
