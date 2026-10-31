/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { deleteMember, toggleMemberPublished } from "../../actions/content";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmSubmit } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Equipe" };

export default async function AdminTeamPage() {
  const team = await db.teamMember.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], include: { areas: { select: { title: true } } } });
  return (
    <>
      <AdminPageHeader
        title="Equipe"
        description="Advogados e integrantes do escritório. Somente integrantes publicados aparecem no site."
        actions={
          <Link href="/admin/equipe/novo" className="btn btn-gold !py-3">
            <Plus className="h-4 w-4" /> Novo integrante
          </Link>
        }
      />
      {team.length === 0 ? (
        <div className="bg-white p-12 text-center">
          <p className="text-muted">Nenhum integrante cadastrado.</p>
          <p className="mt-1 text-xs text-muted">A seção de equipe só aparece no site após o primeiro integrante ser publicado.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {team.map((m) => (
            <li key={m.id} className="flex gap-4 bg-white p-5">
              <div className="arch h-20 w-16 shrink-0 bg-brown-900">
                {m.photo ? <img src={m.photo} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/admin/equipe/${m.id}`} className="font-semibold text-brown-900 hover:text-gold-dark">{m.name}</Link>
                  <StatusBadge state={m.published ? "ACTIVE" : "INACTIVE"} label={m.published ? "Publicado" : "Oculto"} />
                </div>
                <p className="text-xs text-muted">{m.role || "Sem cargo definido"}</p>
                {m.oab && <p className="mt-1 text-xs text-muted">OAB {m.oab} {m.oabVerified ? "· conferida" : "· não exibida (não conferida)"}</p>}
                <p className="mt-1 truncate text-xs text-muted">{m.areas.map((a) => a.title).join(", ")}</p>
                <div className="mt-3 flex items-center gap-3">
                  <form action={toggleMemberPublished.bind(null, m.id)}>
                    <button type="submit" className="text-xs font-semibold text-brown-700 hover:text-gold-dark">{m.published ? "Ocultar" : "Publicar"}</button>
                  </form>
                  <Link href={`/admin/equipe/${m.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-brown-700 hover:text-gold-dark">
                    <Pencil className="h-3 w-3" /> Editar
                  </Link>
                  <form action={deleteMember.bind(null, m.id)}>
                    <ConfirmSubmit message={`Excluir ${m.name} da equipe?`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#a2391f]">
                      <Trash2 className="h-3 w-3" /> Excluir
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
