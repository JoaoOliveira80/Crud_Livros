"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  onNovo: () => void;
}

export default function Header({ onNovo }: HeaderProps) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors px-3 py-1 rounded-full ${
      pathname === path
        ? "text-on-primary-container bg-primary-container hover:opacity-90"
        : "text-on-surface-60 hover:text-primary hover:bg-surface-container-low"
    }`;

  const links = [
    { href: "/", label: "Painel" },
    { href: "/biblioteca", label: "Biblioteca" },
    { href: "/configuracoes", label: "Configurações" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-serif italic text-primary tracking-tight">
            Minha Estante
          </h1>

          <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={linkClass(l.href)}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button
              onClick={() => setMenuAberto(!menuAberto)}
              variant="ghost"
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-surface-container-low text-on-surface-60 focus-ring"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            >
              {menuAberto ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                  ></line>
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                  ></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                  ></line>
                  <line
                    x1="3"
                    y1="12"
                    x2="21"
                    y2="12"
                  ></line>
                  <line
                    x1="3"
                    y1="18"
                    x2="21"
                    y2="18"
                  ></line>
                </svg>
              )}
            </Button>

            <Button
              onClick={onNovo}
              variant="primary"
              className="hidden md:flex items-center gap-2 focus-ring"
            >
              <span className="text-lg leading-none">+</span>
              Adicionar Livro
            </Button>
          </div>
        </div>
      </header>

      {menuAberto && (
        <div
          className="md:hidden fixed inset-0 z-30"
          onClick={() => setMenuAberto(false)}
        >
          <div className="absolute inset-0 bg-on-surface-20 backdrop-blur-sm" />
          <nav
            className="absolute top-20 right-0 w-64 bg-surface-container-lowest border-l border-b border-outline-variant-15 shadow-ambient p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuAberto(false)}
                className={linkClass(l.href)}
              >
                {l.label}
              </Link>
            ))}
            <hr className="border-outline-variant-15" />
            <button
              onClick={() => {
                setMenuAberto(false);
                onNovo();
              }}
              className="btn btn-primary w-full text-sm flex items-center justify-center gap-2"
            >
              <span className="text-lg leading-none">+</span>
              Adicionar Livro
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
