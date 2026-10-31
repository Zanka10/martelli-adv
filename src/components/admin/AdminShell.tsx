"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Building,
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderTree,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Scale,
  Settings,
  ShieldAlert,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/actions/auth";
import { Logo } from "@/components/site/Logo";

type NavItem = { href: string; label: string; icon: typeof FileText; adminOnly?: boolean; badge?: number };

const FLASH: Record<string, string> = {
  salvo: "Alterações salvas com sucesso.",
  criado: "Cadastro criado com sucesso.",
  excluido: "Item excluído.",
  publicado: "Publicação publicada.",
  despublicado: "Publicação despublicada e movida para rascunhos.",
};

function Flash() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const code = params.get("ok");
  const erro = params.get("erro");
  const [visible, setVisible] = useState<string | null>(null);

  useEffect(() => {
    const msg = code ? FLASH[code] : erro === "permissao" ? "Você não tem permissão para acessar esta área." : null;
    if (!msg) return;
    setVisible(msg);
    const next = new URLSearchParams(params);
    next.delete("ok");
    next.delete("erro");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
    const t = setTimeout(() => setVisible(null), 4000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, erro]);

  if (!visible) return null;
  const isError = erro && !code;
  return (
    <div role="status" className="fixed right-4 bottom-4 z-50 flex max-w-sm animate-fade-up items-center gap-3 bg-brown-900 px-5 py-4 text-sm text-cream shadow-2xl">
      {isError ? <ShieldAlert className="h-5 w-5 shrink-0 text-gold" /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />}
      {visible}
    </div>
  );
}

export function AdminShell({
  user,
  officeName,
  unreadMessages,
  children,
}: {
  user: { name: string; email: string; role: string };
  officeName: string;
  unreadMessages: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav: { group: string; items: NavItem[] }[] = [
    { group: "Geral", items: [{ href: "/admin", label: "Painel", icon: LayoutDashboard }] },
    {
      group: "Conteúdo",
      items: [
        { href: "/admin/publicacoes", label: "Publicações", icon: FileText },
        { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
        { href: "/admin/areas", label: "Áreas de atuação", icon: Scale },
        { href: "/admin/equipe", label: "Equipe", icon: Users },
        { href: "/admin/escritorio", label: "O Escritório", icon: Building },
        { href: "/admin/mensagens", label: "Mensagens", icon: Inbox, badge: unreadMessages },
      ],
    },
    {
      group: "Administração",
      items: [
        { href: "/admin/configuracoes", label: "Configurações", icon: Settings, adminOnly: true },
        { href: "/admin/usuarios", label: "Usuários", icon: UserCog, adminOnly: true },
        { href: "/admin/conta", label: "Minha conta", icon: KeyRound },
      ],
    },
  ];

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link href="/admin">
          <Logo name={officeName} className="scale-90 origin-left" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Menu do painel">
        {nav.map((section) => {
          const items = section.items.filter((i) => !i.adminOnly || user.role === "ADMIN");
          if (!items.length) return null;
          return (
            <div key={section.group} className="mb-6">
              <p className="px-3 text-[0.65rem] font-bold tracking-[0.2em] text-cream/35 uppercase">{section.group}</p>
              <ul className="mt-2 space-y-0.5">
                {items.map(({ href, label, icon: Icon, badge }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive(href) ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                        isActive(href) ? "bg-white/10 text-gold-light" : "text-cream/70 hover:bg-white/5 hover:text-cream"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                      <span className="flex-1">{label}</span>
                      {badge ? <span className="rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold text-brown-950">{badge}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="mb-3 flex items-center gap-2 px-2 text-xs text-cream/60 hover:text-gold-light">
          <ExternalLink className="h-3.5 w-3.5" /> Ver site
        </Link>
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 font-serif text-lg text-gold-light">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-cream">{user.name}</p>
            <p className="truncate text-xs text-cream/50">{user.role === "ADMIN" ? "Administrador" : "Editor"}</p>
          </div>
          <form action={logout}>
            <button type="submit" aria-label="Sair" title="Sair" className="flex h-9 w-9 items-center justify-center text-cream/60 hover:text-gold-light">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f0ea]">
      <aside className="texture-dark fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-brown-900 px-4 lg:hidden">
        <Logo name={officeName} className="scale-75 origin-left" />
        <button type="button" onClick={() => setOpen(true)} aria-label="Abrir menu" className="flex h-10 w-10 items-center justify-center text-cream">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="texture-dark absolute inset-y-0 left-0 w-72 animate-fade-up">
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="absolute top-5 right-3 z-10 text-cream/70">
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
      <Suspense>
        <Flash />
      </Suspense>
    </div>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-4xl text-brown-900">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
