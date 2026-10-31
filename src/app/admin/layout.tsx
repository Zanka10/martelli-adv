import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Painel administrativo", template: "%s | Painel" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
