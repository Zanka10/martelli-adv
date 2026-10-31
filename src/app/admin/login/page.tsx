import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AuthCard } from "@/components/admin/AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; redefinida?: string }> }) {
  if (await getCurrentUser()) redirect("/admin");
  const [{ next, redefinida }, s] = await Promise.all([searchParams, getSettings()]);
  return (
    <AuthCard officeName={s.officeName} logo={s.logo} title="Painel administrativo" text="Acesse com seu e-mail e senha para gerenciar o conteúdo do site.">
      <LoginForm next={next} notice={redefinida ? "Senha redefinida com sucesso. Entre com a nova senha." : undefined} />
    </AuthCard>
  );
}
