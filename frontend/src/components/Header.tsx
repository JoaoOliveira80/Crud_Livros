"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  onNovo: () => void;
  onAviso: (msg: string) => void;
}

export default function Header({ onNovo }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);

  const linkClass = (path: string) => 
    `text-sm font-medium transition-colors ${
      pathname === path 
        ? "text-primary border-b-2 border-primary pb-1" 
        : "text-on-surface-60 hover:text-primary"
    }`;

  const links = [
    { href: "/", label: "Painel" },
    { href: "/biblioteca", label: "Biblioteca" },
    { href: "/configuracoes", label: "Configurações" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-outline-variant-10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-serif italic text-primary tracking-tight">
            Minha Estante
          </h1>
          
          <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors hover:bg-surface-container-low text-on-surface-60 hover:text-primary"
              aria-label={theme === "light" ? "Alternar para modo escuro" : "Alternar para modo claro"}
            >
              {theme === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>

            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-surface-container-low text-on-surface-60"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            >
              {menuAberto ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>

            <button onClick={onNovo} className="hidden md:flex btn-primary items-center gap-2">
              <span className="text-lg leading-none">+</span>
              Adicionar Livro
            </button>
          </div>
        </div>
      </header>

      {menuAberto && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setMenuAberto(false)}>
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
              className="btn-primary w-full text-sm flex items-center justify-center gap-2"
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
