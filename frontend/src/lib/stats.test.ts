import {calculateStats, bookProgress} from "./stats";
import type {Livro} from "@/types/livros";

const sample = (id: number, status: Livro["status"], extra: Partial<Livro> = {}): Livro => ({
  id, titulo: `Livro ${id}`, autor: "Autor", genero: "Fantasia", ano: 2020,
  status, paginas: 200, paginaAtual: 0, favorito: false,
  createdAt: "2026-01-01T00:00:00", ...extra,
});

describe("reading analytics", () => {
  it("aggregates statuses, favorites, ratings, pages and genres", () => {
    const stats = calculateStats([
      sample(1,"LIDO",{paginaAtual:200,avaliacao:5,favorito:true}),
      sample(2,"LENDO",{paginaAtual:75,avaliacao:4}),
      sample(3,"QUERO_LER",{genero:"Romance"}),
    ]);
    expect(stats).toMatchObject({total:3,lidos:1,lendo:1,queroLer:1,favoritos:1,paginasLidas:275,paginasCatalogadas:600,avaliacaoMedia:4.5,porGenero:{Fantasia:2,Romance:1}});
  });
  it("reports finished books at 100 percent and protects against division by zero", () => {
    expect(bookProgress(sample(1,"LIDO",{paginas:null}))).toBe(100);
    expect(bookProgress(sample(2,"LENDO",{paginas:null}))).toBe(0);
    expect(bookProgress(sample(3,"LENDO",{paginaAtual:50}))).toBe(25);
  });
  it("returns safe numbers for an empty library", () => {
    expect(calculateStats([]).avaliacaoMedia).toBe(0);
    expect(calculateStats([]).total).toBe(0);
  });
});
