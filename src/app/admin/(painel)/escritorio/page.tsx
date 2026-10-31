import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { OfficeForm } from "./OfficeForm";

export const metadata: Metadata = { title: "O Escritório" };

export default async function OfficeContentPage() {
  const s = await getSettings();
  return (
    <>
      <AdminPageHeader title="O Escritório" description="História, missão, visão, valores e forma de atuação. A equipe é gerenciada no menu Equipe." />
      <OfficeForm s={s} />
    </>
  );
}
