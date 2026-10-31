import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AreaForm } from "@/components/admin/AreaForm";

export const metadata: Metadata = { title: "Nova área de atuação" };

export default async function NewAreaPage() {
  const count = await db.practiceArea.count();
  return (
    <>
      <Link href="/admin/areas" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-brown-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Áreas de atuação
      </Link>
      <AdminPageHeader title="Nova área de atuação" />
      <AreaForm
        area={{ title: "", slug: "", icon: "Scale", image: "", summary: "", description: "", situations: "", complementary: "", order: count, active: true, showInQuoteForm: true }}
      />
    </>
  );
}
