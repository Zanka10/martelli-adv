import { Logo } from "@/components/site/Logo";

export function AuthCard({ officeName, logo, title, text, children }: { officeName: string; logo: string; title: string; text?: string; children: React.ReactNode }) {
  return (
    <main className="texture-dark flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo name={officeName} logo={logo} />
        </div>
        <div className="bg-white p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-10">
          <span className="gold-rule block" />
          <h1 className="mt-5 text-3xl text-brown-900">{title}</h1>
          {text && <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>}
          <div className="mt-8">{children}</div>
        </div>
        <p className="mt-8 text-center text-xs text-cream/40">Área restrita · acesso monitorado</p>
      </div>
    </main>
  );
}
