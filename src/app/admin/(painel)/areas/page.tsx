import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { deleteArea, moveArea, toggleAreaFlag } from "../../actions/content";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { AreaIcon } from "@/components/icons";
import { ConfirmSubmit } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Áreas de atuação" };

function Toggle({ on, label, action }: { on: boolean; label: string; action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        role="switch"
        aria-checked={on}
        aria-label={label}
        title={label}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-gold-dark" : "bg-line"}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
      </button>
    </form>
  );
}

export default async function AdminAreasPage() {
  const areas = await db.practiceArea.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }], include: { _count: { select: { members: true } } } });

  return (
    <>
      <AdminPageHeader
        title="Áreas de atuação"
        description="Serviços jurídicos exibidos no site e no formulário de orçamento. Use as setas para definir a ordem de exibição."
        actions={
          <Link href="/admin/areas/nova" className="btn btn-gold !py-3">
            <Plus className="h-4 w-4" /> Nova área
          </Link>
        }
      />
      {areas.length === 0 ? (
        <div className="bg-white p-12 text-center text-muted">Nenhuma área cadastrada.</div>
      ) : (
        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-line text-left text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="w-20 px-4 py-3 font-semibold">Ordem</th>
                <th className="px-3 py-3 font-semibold">Serviço</th>
                <th className="px-3 py-3 text-center font-semibold">Ativo no site</th>
                <th className="px-3 py-3 text-center font-semibold">No orçamento</th>
                <th className="px-4 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {areas.map((a, i) => (
                <tr key={a.id} className="hover:bg-cream/60">
                  <td className="px-4 py-3">
                    <div className="flex">
                      <form action={moveArea.bind(null, a.id, "up")}>
                        <button type="submit" disabled={i === 0} aria-label="Mover para cima" className="flex h-7 w-7 items-center justify-center text-brown-700 disabled:opacity-25">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                      </form>
                      <form action={moveArea.bind(null, a.id, "down")}>
                        <button type="submit" disabled={i === areas.length - 1} aria-label="Mover para baixo" className="flex h-7 w-7 items-center justify-center text-brown-700 disabled:opacity-25">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <AreaIcon name={a.icon} className="h-6 w-6 shrink-0 text-gold-dark" />
                      <div>
                        <Link href={`/admin/areas/${a.id}`} className="font-semibold text-brown-900 hover:text-gold-dark">{a.title}</Link>
                        <p className="text-xs text-muted">/{a.slug} · {a._count.members} na equipe</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center">
                      <Toggle on={a.active} label="Exibir no site" action={toggleAreaFlag.bind(null, a.id, "active")} />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center">
                      <Toggle on={a.showInQuoteForm} label="Exibir no formulário de orçamento" action={toggleAreaFlag.bind(null, a.id, "showInQuoteForm")} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/areas/${a.id}`} aria-label="Editar" className="flex h-8 w-8 items-center justify-center text-brown-700 hover:text-gold-dark">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deleteArea.bind(null, a.id)}>
                        <ConfirmSubmit message={`Excluir a área “${a.title}”?`} className="flex h-8 w-8 items-center justify-center text-[#a2391f]">
                          <Trash2 className="h-4 w-4" aria-label="Excluir" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
