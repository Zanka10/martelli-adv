import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AreaForm } from "@/components/admin/AreaForm";

export const metadata: Metadata = { title: "Editar área de atuação" };

export default async function EditAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const area = await db.practiceArea.findUnique({ where: { id: (await params).id } });
  if (!area) notFound();
  return (
    <>
      <Link href="/admin/areas" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-brown-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Áreas de atuação
      </Link>
      <AdminPageHeader
        title={area.title}
        actions={
          area.active ? (
            <Link href={`/areas-de-atuacao/${area.slug}`} target="_blank" className="btn btn-outline !py-2.5">
              <ExternalLink className="h-4 w-4" /> Ver no site
            </Link>
          ) : undefined
        }
      />
      <AreaForm key={area.updatedAt.toISOString()} area={{ ...area, image: area.image ?? "" }} />
    </>
  );
}
