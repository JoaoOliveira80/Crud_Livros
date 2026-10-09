"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Icon } from "./Icons";
import { BookEditor } from "./BookEditor";
import { BookDetails } from "./BookDetails";

const nav = [
  {href: "/", label: "Visão geral", icon: "grid"},
  {href: "/biblioteca", label: "Minha biblioteca", icon: "library"},
  {href: "/estatisticas", label: "Estatísticas", icon: "chart"},
  {href: "/configuracoes", label: "Preferências", icon: "settings"},
] as const;

export function AppShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const {openEditor, stats, demo, connectionIssue, notice, clearNotice, theme, setTheme, goal} = useLibrary();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {if (!notice) return; const timeout = setTimeout(clearNotice, 4200); return () => clearTimeout(timeout);}, [notice, clearNotice]);
  const goalPct = Math.min(100, Math.round(stats.lidos / goal * 100));
  return <div className="app-layout">
    {menuOpen && <button className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}/>}
    <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-top"><Link href="/" className="brand" aria-label="Entrelinhas, início"><span className="brand-icon"><Icon name="book" size={23}/></span><span className="brand-text">entrelinhas<span>.</span><small>ATELIÊ DE LEITURA</small></span></Link><p className="sidebar-kicker">SEU ESPAÇO LITERÁRIO</p></div>
      <nav className="sidebar-nav" aria-label="Menu principal">{nav.map(item => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={pathname === item.href ? "page" : undefined} className={`nav-link ${pathname === item.href ? "nav-active" : ""}`}><Icon name={item.icon} size={19}/><span>{item.label}</span>{pathname === item.href && <span className="nav-dot"/>}</Link>)}</nav>
      <div className="sidebar-fill"/>
      <div className="sidebar-goal"><div className="sidebar-goal-top"><span><Icon name="sparkles" size={16}/> SUA META ANUAL</span><span>{goalPct}%</span></div><div className="sidebar-goal-number"><strong>{stats.lidos}</strong><span> / {goal} livros</span></div><div className="sidebar-goal-bar"><span style={{width: `${goalPct}%`}}/></div><p>Uma página de cada vez.</p></div>
      <div className="sidebar-foot"><span className="avatar">E</span><div><strong>Meu espaço</strong><span>{demo ? "Ambiente de demonstração" : "Biblioteca conectada"}</span></div><span className="sidebar-online"/></div>
    </aside>
    <div className="main-column">
      <header className="topbar"><div className="topbar-start"><button type="button" className="icon-button mobile-menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Abrir menu"><Icon name="menu"/></button><div className="breadcrumbs"><span>MEU ESPAÇO</span><Icon name="chevron" size={12}/><strong>{nav.find(n => n.href === pathname)?.label ?? "Entrelinhas"}</strong></div></div><div className="topbar-end"><span className={`environment-label ${connectionIssue ? "environment-warning" : ""}`}><span/>{connectionIssue ? "API offline · modo demo" : demo ? "Modo demonstração" : "API conectada"}</span><button type="button" className="icon-button theme-button" aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"} title="Alternar tema" onClick={() => setTheme(theme === "light" ? "dark" : "light")}><Icon name={theme === "light" ? "moon" : "sun"} size={18}/></button><button type="button" className="btn btn-primary add-top" onClick={() => openEditor()}><Icon name="plus" size={18}/> <span>Novo livro</span></button></div></header>
      <main className="workspace" id="main-content">{children}</main>
      <footer className="app-footer"><span>© {new Date().getFullYear()} Entrelinhas Ateliê de Leitura</span><span>Feito para quem vive entre histórias <span aria-hidden="true">✳</span></span></footer>
    </div>
    <BookDetails/><BookEditor/>
    {notice && <div role="status" className="toast-notice"><Icon name="check" size={19}/><span>{notice}</span><button type="button" aria-label="Fechar aviso" onClick={clearNotice}><Icon name="close" size={16}/></button></div>}
  </div>;
}
