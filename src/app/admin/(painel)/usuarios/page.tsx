import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { deleteUser, updateUser } from "../../actions/users";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmSubmit } from "@/components/admin/ui";
import { NewUserForm, ResetUserPassword } from "./UserForms";

export const metadata: Metadata = { title: "Usuários" };

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await db.user.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] });

  return (
    <>
      <AdminPageHeader
        title="Usuários"
        description="Administradores têm acesso total. Editores gerenciam publicações, áreas, equipe e conteúdo institucional, sem acesso a configurações e usuários."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <ul className="space-y-3">
          {users.map((u) => (
            <li key={u.id} className="bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brown-900">
                    {u.name} {u.id === me.id && <span className="text-xs font-normal text-muted">(você)</span>}
                  </p>
                  <p className="text-xs text-muted">{u.email}</p>
                  <p className="mt-1 text-xs text-muted">Último acesso: {u.lastLoginAt ? formatDate(u.lastLoginAt, true) : "nunca"}</p>
                </div>
                <StatusBadge state={u.active ? "ACTIVE" : "INACTIVE"} label={u.active ? "Ativo" : "Desativado"} />
              </div>
              <form action={updateUser.bind(null, u.id)} className="mt-4 flex flex-wrap items-center gap-3">
                <select name="role" defaultValue={u.role} aria-label="Permissão" className="field !w-auto !py-2 text-sm">
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={u.active} disabled={u.id === me.id} className="h-4 w-4 accent-[var(--color-gold-dark)]" />
                  Ativo
                </label>
                {u.id === me.id && <input type="hidden" name="active" value="on" />}
                <button type="submit" className="btn btn-outline !px-4 !py-2">Salvar</button>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {u.id !== me.id && <ResetUserPassword id={u.id} name={u.name} />}
                {u.id !== me.id && (
                  <form action={deleteUser.bind(null, u.id)}>
                    <ConfirmSubmit message={`Excluir o usuário ${u.name}?`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#a2391f]">
                      <Trash2 className="h-3 w-3" /> Excluir
                    </ConfirmSubmit>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="self-start">
          <NewUserForm />
        </div>
      </div>
    </>
  );
}
