import type { Livro } from "@/types/livros";

export interface ReadingStats {
  total: number; lidos: number; lendo: number; queroLer: number; favoritos: number;
  paginasLidas: number; paginasCatalogadas: number; avaliacaoMedia: number;
  porGenero: Record<string, number>;
}

export function calculateStats(livros: Livro[]): ReadingStats {
  const porGenero: Record<string, number> = {};
  let lidos = 0, lendo = 0, favoritos = 0, paginasLidas = 0, paginasCatalogadas = 0;
  const avaliacoes: number[] = [];
  for (const livro of livros) {
    if (livro.status === "LIDO") lidos++;
    else if (livro.status === "LENDO") lendo++;
    if (livro.favorito) favoritos++;
    paginasLidas += livro.paginaAtual ?? 0;
    paginasCatalogadas += livro.paginas ?? 0;
    if (livro.avaliacao != null) avaliacoes.push(livro.avaliacao);
    porGenero[livro.genero] = (porGenero[livro.genero] ?? 0) + 1;
  }
  return {
    total: livros.length, lidos, lendo, queroLer: livros.length - lidos - lendo,
    favoritos, paginasLidas, paginasCatalogadas,
    avaliacaoMedia: avaliacoes.length ? Math.round(avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length * 10) / 10 : 0,
    porGenero,
  };
}

export function bookProgress(livro: Livro): number {
  if (livro.status === "LIDO") return 100;
  return livro.paginas ? Math.min(100, Math.round((livro.paginaAtual ?? 0) / livro.paginas * 100)) : 0;
}

export const statusLabel: Record<Livro["status"], string> = {
  QUERO_LER: "Quero ler", LENDO: "Lendo agora", LIDO: "Concluído",
};

export function bookPayload(livro: Livro) {
  return {
    titulo: livro.titulo, autor: livro.autor, genero: livro.genero,
    ano: livro.ano, descricao: livro.descricao ?? "", status: livro.status,
    avaliacao: livro.avaliacao ?? null, paginas: livro.paginas ?? null,
    paginaAtual: livro.paginaAtual ?? 0, favorito: livro.favorito ?? false,
    notas: livro.notas ?? "", isbn: livro.isbn ?? "",
  };
}
