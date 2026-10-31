import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { MemberForm } from "@/components/admin/MemberForm";

export const metadata: Metadata = { title: "Editar integrante" };

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, areas] = await Promise.all([
    db.teamMember.findUnique({ where: { id }, include: { areas: { select: { id: true } } } }),
    db.practiceArea.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);
  if (!member) notFound();
  return (
    <>
      <Link href="/admin/equipe" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-brown-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Equipe
      </Link>
      <AdminPageHeader title={member.name} />
      <MemberForm
        key={member.updatedAt.toISOString()}
        areas={areas}
        member={{ ...member, oab: member.oab ?? "", photo: member.photo ?? "", areaIds: member.areas.map((a) => a.id) }}
      />
    </>
  );
}
