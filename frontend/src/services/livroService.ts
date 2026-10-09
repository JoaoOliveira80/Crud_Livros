import type { Livro, LivroForm, PageResponse } from "@/types/livros";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/livros";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", ...init });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se o servidor está ativo.");
  }
  if (!response.ok) {
    let message = `Não foi possível completar a operação (${response.status}).`;
    try {
      const body: { erro?: string; detail?: string; message?: string } = await response.json();
      message = body.erro || body.detail || body.message || message;
    } catch { /* API can return empty/plain-text errors */ }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const json = (method: string, body: unknown): RequestInit => ({
  method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

export const livroService = {
  listarTodos: () => request<Livro[]>(BASE_URL),
  listarPaginado: (page: number, size = 12, sortBy = "createdAt", sortDir: "asc" | "desc" = "desc", busca?: string, genero?: string, status?: string) => {
    const params = new URLSearchParams({page: String(page), size: String(size), sortBy, sortDir});
    if (busca) params.set("busca", busca);
    if (genero) params.set("genero", genero);
    if (status) params.set("status", status);
    return request<PageResponse<Livro>>(`${BASE_URL}/paginado?${params}`);
  },
  buscarPorId: (id: number) => request<Livro>(`${BASE_URL}/${id}`),
  criar: (dados: LivroForm) => request<Livro>(BASE_URL, json("POST", dados)),
  atualizar: (id: number, dados: LivroForm) => request<Livro>(`${BASE_URL}/${id}`, json("PUT", dados)),
  deletar: (id: number) => request<void>(`${BASE_URL}/${id}`, { method: "DELETE" }),
  importar: (livros: Partial<LivroForm>[]) => request<Livro[]>(`${BASE_URL}/importar`, json("POST", livros)),
  progresso: (id: number, paginaAtual: number) => request<Livro>(`${BASE_URL}/${id}/progresso`, json("PATCH", { paginaAtual })),
  favorito: (id: number) => request<Livro>(`${BASE_URL}/${id}/favorito`, {method: "PATCH"}),
  estatisticas: () => request<import("@/lib/stats").ReadingStats>(`${BASE_URL}/estatisticas`),
};
