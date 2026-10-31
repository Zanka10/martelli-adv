import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <AdminPageHeader title="Configurações gerais" description="Dados do escritório, canais de contato e textos exibidos no site." />
      <SettingsForm s={s} />
    </>
  );
}
