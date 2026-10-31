import Link from "next/link";

export default function NotFound() {
  return (
    <section className="texture-dark">
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <span className="font-serif text-8xl text-gold/80">404</span>
        <h1 className="mt-4 text-4xl text-cream">Página não encontrada</h1>
        <p className="mt-4 max-w-md text-cream/70">O endereço acessado não existe ou o conteúdo não está mais disponível.</p>
        <Link href="/" className="btn btn-gold mt-10">
          Voltar à página inicial
        </Link>
      </div>
    </section>
  );
}
