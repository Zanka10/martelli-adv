import Link from "next/link";
import { ArrowRight, Building, CalendarClock, CheckCircle2, FilePen, FileText, Inbox, Plus, Scale, Settings, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/format";
import { POST_STATE_LABELS, postState } from "@/lib/posts";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();
  const [total, published, drafts, scheduled, areas, activeAreas, team, publishedTeam, unread, recent, s] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { status: "PUBLISHED", publishedAt: { lte: now } } }),
    db.post.count({ where: { status: "DRAFT" } }),
    db.post.count({ where: { status: "PUBLISHED", publishedAt: { gt: now } } }),
    db.practiceArea.count(),
    db.practiceArea.count({ where: { active: true } }),
    db.teamMember.count(),
    db.teamMember.count({ where: { published: true } }),
    db.contactMessage.count({ where: { read: false } }),
    db.post.findMany({ orderBy: { updatedAt: "desc" }, take: 6, select: { id: true, title: true, status: true, publishedAt: true, updatedAt: true } }),
    getSettings(),
  ]);

  const stats = [
    { label: "Total de publicações", value: total, icon: FileText, href: "/admin/publicacoes" },
    { label: "Publicadas", value: published, icon: CheckCircle2, href: "/admin/publicacoes?status=PUBLISHED" },
    { label: "Rascunhos", value: drafts, icon: FilePen, href: "/admin/publicacoes?status=DRAFT" },
    { label: "Agendadas", value: scheduled, icon: CalendarClock, href: "/admin/publicacoes?status=SCHEDULED" },
    { label: "Áreas de atuação", value: areas, hint: `${activeAreas} ativas`, icon: Scale, href: "/admin/areas" },
    { label: "Equipe cadastrada", value: team, hint: `${publishedTeam} publicados`, icon: Users, href: "/admin/equipe" },
  ];

  const pending = [
    !s.whatsapp && "Cadastre o WhatsApp comercial — ele é necessário para o formulário de orçamento.",
    !s.phone && !s.email && "Cadastre telefone e e-mail de contato.",
    !s.address && "Informe o endereço do escritório para exibir o mapa na página de contato.",
    !s.officeHistory && "Escreva a história do escritório na seção O Escritório.",
  ].filter(Boolean) as string[];

  return (
    <>
      <AdminPageHeader
        title={`Olá, ${user.name.split(" ")[0]}`}
        description="Resumo do conteúdo publicado no site."
        actions={
          <>
            <Link href="/admin/publicacoes/nova" className="btn btn-gold !py-3">
              <Plus className="h-4 w-4" /> Nova publicação
            </Link>
            <Link href="/admin/escritorio" className="btn btn-outline !py-3">
              <Building className="h-4 w-4" /> Informações institucionais
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon, href }) => (
          <Link key={label} href={href} className="group flex items-start justify-between bg-white p-6 transition-shadow hover:shadow-lg">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{label}</p>
              <p className="mt-3 font-serif text-5xl leading-none text-brown-900">{value}</p>
              {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-gold-dark transition-colors group-hover:bg-brown-900 group-hover:text-gold">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-brown-900">Atualizadas recentemente</h2>
            <Link href="/admin/publicacoes" className="link-gold">
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Nenhuma publicação cadastrada ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <Link href={`/admin/publicacoes/${p.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold text-brown-900 hover:text-gold-dark">
                    {p.title}
                  </Link>
                  <StatusBadge state={postState(p)} label={POST_STATE_LABELS[postState(p)]} />
                  <span className="hidden w-32 text-right text-xs text-muted sm:block">{formatDate(p.updatedAt, true)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <Link href="/admin/mensagens" className="flex items-center gap-4 bg-brown-900 p-6 text-cream transition-colors hover:bg-brown-800">
            <Inbox className="h-8 w-8 text-gold" strokeWidth={1.4} />
            <div className="flex-1">
              <p className="font-serif text-2xl">{unread} {unread === 1 ? "mensagem não lida" : "mensagens não lidas"}</p>
              <p className="text-xs text-cream/60">Enviadas pelo formulário de contato</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gold" />
          </Link>

          {pending.length > 0 && (
            <section className="border border-gold/40 bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl text-brown-900">
                <Settings className="h-4 w-4 text-gold-dark" /> Configuração pendente
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-ink/80">
                {pending.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-dark" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link href={user.role === "ADMIN" ? "/admin/configuracoes" : "/admin/escritorio"} className="link-gold mt-5">
                Configurar agora <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
