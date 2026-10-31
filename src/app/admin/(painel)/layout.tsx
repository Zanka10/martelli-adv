import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [s, unread] = await Promise.all([getSettings(), db.contactMessage.count({ where: { read: false } })]);
  return (
    <AdminShell user={user} officeName={s.officeName} unreadMessages={unread}>
      {children}
    </AdminShell>
  );
}
