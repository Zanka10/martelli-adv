import type { Metadata } from "next";
import { requireUser, ROLE_LABELS } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata: Metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <AdminPageHeader title="Minha conta" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white p-6">
          <h2 className="font-serif text-xl text-brown-900">Dados de acesso</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-xs text-muted">Nome</dt><dd className="text-brown-900">{user.name}</dd></div>
            <div><dt className="text-xs text-muted">E-mail</dt><dd className="text-brown-900">{user.email}</dd></div>
            <div><dt className="text-xs text-muted">Permissão</dt><dd className="text-brown-900">{ROLE_LABELS[user.role]}</dd></div>
          </dl>
        </section>
        <ChangePasswordForm />
      </div>
    </>
  );
}
