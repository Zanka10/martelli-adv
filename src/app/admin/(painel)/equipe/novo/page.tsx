import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { MemberForm } from "@/components/admin/MemberForm";

export const metadata: Metadata = { title: "Novo integrante" };

export default async function NewMemberPage() {
  const [areas, count] = await Promise.all([
    db.practiceArea.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
    db.teamMember.count(),
  ]);
  return (
    <>
      <Link href="/admin/equipe" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-brown-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Equipe
      </Link>
      <AdminPageHeader title="Novo integrante" />
      <MemberForm areas={areas} member={{ name: "", role: "", oab: "", oabVerified: false, bio: "", photo: "", order: count, published: false, areaIds: [] }} />
    </>
  );
}
