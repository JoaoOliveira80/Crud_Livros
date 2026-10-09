import {livroService} from "./livroService";

const livro = {id:1,titulo:"Duna",autor:"Frank Herbert",genero:"Ficção",ano:1965,status:"LENDO",createdAt:"2026-01-01"};
const mockFetch = (body: unknown, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({ok: status >= 200 && status < 300,status,json: async()=>body});
};

afterEach(() => jest.restoreAllMocks());

describe("livroService REST contract", () => {
  it("lists books from the API", async () => {
    mockFetch([livro]);
    await expect(livroService.listarTodos()).resolves.toEqual([livro]);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/livros"), {cache:"no-store"});
  });
  it("encodes search filters in paginated requests", async () => {
    mockFetch({content: [],totalElements:0});
    await livroService.listarPaginado(1, 10, "titulo", "asc", "Machado", "Romance", "LIDO");
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("busca=Machado");
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("status=LIDO");
  });
  it("updates progress with PATCH, without overwriting other fields", async () => {
    mockFetch({...livro, paginaAtual:42});
    await livroService.progresso(1,42);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/1/progresso"), expect.objectContaining({method:"PATCH",body:'{"paginaAtual":42}'}));
  });
  it("propagates human-readable API errors", async () => {
    mockFetch({erro:"Título é obrigatório"},400);
    await expect(livroService.criar({titulo:"",autor:"Autor",genero:"Ficção",ano:2026,status:"QUERO_LER",descricao:""})).rejects.toThrow("Título é obrigatório");
  });
  it("handles successful 204 deletion", async () => {
    global.fetch = jest.fn().mockResolvedValue({ok:true,status:204});
    await expect(livroService.deletar(1)).resolves.toBeUndefined();
  });
});
