import { Livro, LivroForm, PageResponse } from "../types/livros";

const BASE_URL = "http://localhost:8080/api/livros";

export const livroService = {
  async listarTodos(): Promise<Livro[]> {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Erro ao buscar livros");
    return res.json();
  },

  async listarPaginado(
    page: number,
    size: number = 12,
    sortBy: string = "createdAt",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<PageResponse<Livro>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });
    const res = await fetch(`${BASE_URL}/paginado?${params}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erro ao buscar livros");
    return res.json();
  },

  async buscarPorId(id: number): Promise<Livro> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Livro não encontrado");
    return res.json();
  },

  async criar(dados: LivroForm): Promise<Livro> {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.erro || "Erro ao criar livro");
    }
    return res.json();
  },

  async atualizar(id: number, dados: LivroForm): Promise<Livro> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.erro || "Erro ao atualizar livro");
    }
    return res.json();
  },

  async deletar(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar livro");
  },

  async importar(livros: Partial<LivroForm>[]): Promise<Livro[]> {
    const criados: Livro[] = [];
    for (const livro of livros) {
      const criado = await this.criar(livro as LivroForm);
      criados.push(criado);
    }
    return criados;
  },
};
