import type { Metadata } from "next";
import "./globals.css";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { AppShell } from "@/components/entrelinhas/AppShell";

export const metadata: Metadata = {
  title: {default: "Entrelinhas — Sua vida entre livros", template: "%s · Entrelinhas"},
  description: "Um espaço para ler com intenção. Organize sua biblioteca, acompanhe seus livros e descubra seus hábitos de leitura.",
  applicationName: "Entrelinhas",
  keywords: ["Entrelinhas", "biblioteca pessoal", "leituras", "organização de livros", "metas de leitura"],
  openGraph: {
    title: "Entrelinhas — Sua vida entre livros",
    description: "Organize suas leituras, acompanhe metas e descubra seus hábitos no Entrelinhas.",
    locale: "pt_BR",
    type: "website",
    siteName: "Entrelinhas",
  },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR" suppressHydrationWarning><body><LibraryProvider><AppShell>{children}</AppShell></LibraryProvider></body></html>;
}
