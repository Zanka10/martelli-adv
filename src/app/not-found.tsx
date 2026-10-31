import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <main className="texture-dark flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Link href="/" aria-label="Página inicial">
        <Logo name="Martelli Advogados e Associados" />
      </Link>
      <span className="mt-14 font-serif text-8xl text-gold/80">404</span>
      <h1 className="mt-4 text-4xl text-cream">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-cream/70">O endereço acessado não existe ou o conteúdo não está mais disponível.</p>
      <Link href="/" className="btn btn-gold mt-10">
        Voltar à página inicial
      </Link>
    </main>
  );
}
