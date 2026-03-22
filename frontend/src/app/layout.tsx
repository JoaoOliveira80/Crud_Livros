import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Minha Estante",
  description: "Gerencie seus livros",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${newsreader.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
