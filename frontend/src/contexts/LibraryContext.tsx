"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import demoBooks from "@/lib/demo.json";
import { calculateStats } from "@/lib/stats";
import { livroService } from "@/services/livroService";
import type { Livro, LivroForm } from "@/types/livros";

const STORAGE_KEY = "entrelinhas-library-v2";
const GOAL_KEY = "entrelinhas-year-goal";
const THEME_KEY = "entrelinhas-theme";
const preferredMode = process.env.NEXT_PUBLIC_DATA_MODE ?? (process.env.NEXT_PUBLIC_API_URL ? "api" : "demo");
const initialBooks = demoBooks as Livro[];

type Theme = "light" | "dark";
type LibraryContextValue = {
  livros: Livro[]; loading: boolean; demo: boolean; connectionIssue: boolean;
  goal: number; theme: Theme; stats: ReturnType<typeof calculateStats>;
  editing: Livro | null | "new"; viewing: Livro | null;
  notice: string | null;
  setGoal: (goal: number) => void; setTheme: (theme: Theme) => void;
  openEditor: (livro?: Livro) => void; closeEditor: () => void;
  openDetails: (livro: Livro) => void; closeDetails: () => void;
  saveBook: (data: LivroForm) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  setProgress: (id: number, page: number) => Promise<void>;
  importBooks: (data: unknown) => Promise<number>;
  exportBooks: () => void;
  restoreDemo: () => void; reconnect: () => Promise<void>; notify: (message: string) => void; clearNotice: () => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

function loadDemo(): Livro[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialBooks;
    const value: unknown = JSON.parse(stored);
    return Array.isArray(value) ? (value as Livro[]) : initialBooks;
  } catch { return initialBooks; }
}

function persistDemo(livros: Livro[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(livros));
}

function normalizeBook(data: LivroForm, id: number, createdAt?: string): Livro {
  const paginas = data.paginas || null;
  const paginaAtual = Math.max(0, Number(data.paginaAtual) || 0);
  return {
    ...data, id, ano: Number(data.ano), paginas, paginaAtual,
    status: data.status, avaliacao: data.avaliacao ?? null, favorito: !!data.favorito,
    createdAt: createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
}

export function LibraryProvider({children}: {children: React.ReactNode}) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(preferredMode !== "api");
  const [connectionIssue, setConnectionIssue] = useState(false);
  const [goal, updateGoal] = useState(12);
  const [theme, updateTheme] = useState<Theme>("light");
  const [editing, setEditing] = useState<Livro | "new" | null>(null);
  const [viewing, setViewing] = useState<Livro | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(GOAL_KEY));
      if (saved >= 1 && saved <= 200) updateGoal(saved);
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === "dark" || savedTheme === "light") updateTheme(savedTheme);
    } catch { /* Storage unavailable, use defaults. */ }
    let active = true;
    if (preferredMode !== "api") {
      setLivros(loadDemo()); setLoading(false);
    } else {
      livroService.listarTodos().then((items) => {
        if (active) {setLivros(items); setDemo(false);}
      }).catch(() => {
        if (active) {setLivros(loadDemo()); setDemo(true); setConnectionIssue(true);}
      }).finally(() => {if (active) setLoading(false);});
    }
    return () => {active = false;};
  }, []);

  useEffect(() => {document.documentElement.dataset.theme = theme;}, [theme]);
  const setGoal = useCallback((value: number) => {
    const next = Math.max(1, Math.min(200, Math.round(value) || 1));
    updateGoal(next);
    try {localStorage.setItem(GOAL_KEY, String(next));} catch { /* ignore */ }
  }, []);
  const setTheme = useCallback((value: Theme) => {
    updateTheme(value);
    try {localStorage.setItem(THEME_KEY, value);} catch { /* ignore */ }
  }, []);

  const commitDemo = useCallback((updater: (prev: Livro[]) => Livro[]) => {
    setLivros((prev) => {
      const next = updater(prev);
      try {persistDemo(next);} catch { /* show state even if storage is blocked */ }
      return next;
    });
  }, []);

  const saveBook = useCallback(async (data: LivroForm) => {
    if (!data.titulo.trim() || !data.autor.trim() || !data.genero.trim()) throw new Error("Preencha título, autor e gênero.");
    if (!data.ano || data.ano < 1000 || data.ano > 2100) throw new Error("Informe um ano entre 1000 e 2100.");
    if (data.paginas != null && data.paginas < 1) throw new Error("O total de páginas deve ser positivo.");
    if ((data.paginaAtual ?? 0) < 0 || (data.paginas && (data.paginaAtual ?? 0) > data.paginas)) throw new Error("O progresso não pode exceder o total de páginas.");
    const isEditing = editing !== null && editing !== "new";
    if (demo) {
      const updated = normalizeBook(data, isEditing ? editing.id : Math.max(0, ...livros.map(l => l.id)) + 1, isEditing ? editing.createdAt : undefined);
      commitDemo((prev) => isEditing ? prev.map(l => l.id === updated.id ? updated : l) : [updated, ...prev]);
    } else {
      const saved = isEditing ? await livroService.atualizar(editing.id, data) : await livroService.criar(data);
      setLivros((prev) => isEditing ? prev.map(l => l.id === saved.id ? saved : l) : [saved, ...prev]);
    }
    setEditing(null); setNotice(isEditing ? "Livro atualizado com sucesso." : "Novo livro adicionado à biblioteca.");
  }, [commitDemo, demo, editing, livros]);

  const deleteBook = useCallback(async (id: number) => {
    if (!demo) await livroService.deletar(id);
    if (demo) commitDemo(prev => prev.filter(l => l.id !== id));
    else setLivros(prev => prev.filter(l => l.id !== id));
    setViewing(null); setEditing(null); setNotice("Livro removido da biblioteca.");
  }, [commitDemo, demo]);

  const toggleFavorite = useCallback(async (id: number) => {
    if (demo) commitDemo(prev => prev.map(l => l.id === id ? {...l, favorito: !l.favorito} : l));
    else {
      const updated = await livroService.favorito(id);
      setLivros(prev => prev.map(l => l.id === id ? updated : l));
    }
    setViewing(prev => prev?.id === id ? {...prev, favorito: !prev.favorito} : prev);
  }, [commitDemo, demo]);

  const setProgress = useCallback(async (id: number, page: number) => {
    const current = livros.find(l => l.id === id);
    if (!current?.paginas) throw new Error("Defina o total de páginas no cadastro primeiro.");
    if (!Number.isInteger(page) || page < 0 || page > current.paginas) throw new Error(`Informe um número entre 0 e ${current.paginas}.`);
    if (demo) {
      commitDemo(prev => prev.map(l => l.id === id ? {
        ...l, paginaAtual: page, status: page === l.paginas ? "LIDO" : page > 0 ? "LENDO" : l.status,
        updatedAt: new Date().toISOString(),
      } : l));
    } else {
      const updated = await livroService.progresso(id, page);
      setLivros(prev => prev.map(l => l.id === id ? updated : l));
    }
    setViewing(null); setNotice("Progresso de leitura registrado.");
  }, [livros, demo, commitDemo]);

  const importBooks = useCallback(async (raw: unknown): Promise<number> => {
    const input = Array.isArray(raw) ? raw : [raw];
    if (input.length === 0 || input.length > 500) throw new Error("Importe entre 1 e 500 livros por arquivo.");
    if (!input.every((x) => x && typeof x === "object" && typeof x.titulo === "string" && x.titulo.trim() && typeof x.autor === "string" && x.autor.trim() && typeof x.genero === "string" && x.genero.trim() && Number.isInteger(x.ano) && x.ano >= 1000 && x.ano <= 2100 && ["QUERO_LER", "LENDO", "LIDO"].includes(x.status) && (x.paginas == null || Number.isInteger(x.paginas) && x.paginas > 0) && (x.paginaAtual == null || Number.isInteger(x.paginaAtual) && x.paginaAtual >= 0 && (x.paginas == null || x.paginaAtual <= x.paginas)))) {
      throw new Error("O arquivo contém dados inválidos. Confira título, autor, gênero, ano, status e páginas.");
    }
    const seen = new Set(livros.map((l) => `${l.titulo}|${l.autor}`.toLocaleLowerCase("pt-BR")));
    const unique = (input as LivroForm[]).filter((l) => {
      const key = `${l.titulo}|${l.autor}`.toLocaleLowerCase("pt-BR");
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    if (demo) {
      let nextId = Math.max(0, ...livros.map(l => l.id));
      commitDemo(prev => [...unique.map(l => normalizeBook(l, ++nextId)), ...prev]);
    } else if (unique.length) {
      const created = await livroService.importar(unique);
      setLivros(prev => [...created, ...prev]);
      setNotice(`${created.length} livro(s) importado(s).`);
      return created.length;
    }
    setNotice(`${unique.length} livro(s) importado(s).`);
    return unique.length;
  }, [livros, commitDemo, demo]);

  const exportBooks = useCallback(() => {
    const blob = new Blob([JSON.stringify(livros, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `entrelinhas-biblioteca-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Sua biblioteca foi exportada.");
  }, [livros]);

  const restoreDemo = useCallback(() => {
    if (!demo) return;
    commitDemo(() => initialBooks);
    setNotice("Coleção de demonstração restaurada.");
  }, [commitDemo, demo]);

  const reconnect = useCallback(async () => {
    setLoading(true);
    try {
      const items = await livroService.listarTodos();
      setLivros(items); setDemo(false); setConnectionIssue(false);
      setNotice("Conexão com a API restabelecida.");
    } catch {
      setConnectionIssue(true); setNotice("API indisponível. Seus dados de demonstração continuam acessíveis.");
    } finally {setLoading(false);}
  }, []);

  const value = useMemo(() => ({
    livros, loading, demo, connectionIssue, goal, theme, stats: calculateStats(livros),
    editing, viewing, notice, setGoal, setTheme,
    openEditor: (livro?: Livro) => {setViewing(null); setEditing(livro ?? "new");},
    closeEditor: () => setEditing(null),
    openDetails: (livro: Livro) => setViewing(livro),
    closeDetails: () => setViewing(null),
    saveBook, deleteBook, toggleFavorite, setProgress, importBooks, exportBooks,
    restoreDemo, reconnect, notify: setNotice, clearNotice: () => setNotice(null),
  }), [livros, loading, demo, connectionIssue, goal, theme, editing, viewing, notice, setGoal, setTheme, saveBook, deleteBook, toggleFavorite, setProgress, importBooks, exportBooks, restoreDemo, reconnect]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary deve ser usado dentro de LibraryProvider");
  return ctx;
}
