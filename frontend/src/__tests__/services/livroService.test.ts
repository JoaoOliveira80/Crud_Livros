import { livroService } from "@/services/livroService";

const mockLivro = {
  id: 1,
  titulo: "Dom Casmurro",
  autor: "Machado de Assis",
  genero: "Romance",
  ano: 1899,
  descricao: "Clássico brasileiro",
  status: "QUERO_LER",
  createdAt: "2026-01-01T00:00:00",
};

const mockPageResponse = {
  content: [mockLivro],
  totalElements: 1,
  totalPages: 1,
  size: 12,
  number: 0,
  first: true,
  last: true,
  empty: false,
};

describe("livroService", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("listarTodos", () => {
    it("deve retornar lista de livros", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [mockLivro],
      });

      const result = await livroService.listarTodos();

      expect(result).toEqual([mockLivro]);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/livros",
        { cache: "no-store" }
      );
    });

    it("deve lançar erro quando a requisição falha", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

      await expect(livroService.listarTodos()).rejects.toThrow(
        "Erro ao buscar livros"
      );
    });
  });

  describe("listarPaginado", () => {
    it("deve retornar página de livros", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPageResponse,
      });

      const result = await livroService.listarPaginado(0, 12);

      expect(result).toEqual(mockPageResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/paginado?page=0&size=12"),
        { cache: "no-store" }
      );
    });

    it("deve incluir filtros quando fornecidos", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPageResponse,
      });

      await livroService.listarPaginado(0, 12, "createdAt", "desc", "Machado", "Romance", "LIDO");

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("busca=Machado");
      expect(calledUrl).toContain("genero=Romance");
      expect(calledUrl).toContain("status=LIDO");
    });

    it("não deve incluir filtros vazios", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPageResponse,
      });

      await livroService.listarPaginado(0, 12);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).not.toContain("busca=");
      expect(calledUrl).not.toContain("genero=");
      expect(calledUrl).not.toContain("status=");
    });
  });

  describe("criar", () => {
    it("deve criar um novo livro", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockLivro,
      });

      const form = {
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        genero: "Romance",
        ano: 1899,
        descricao: "",
        status: "QUERO_LER" as const,
      };

      const result = await livroService.criar(form);

      expect(result).toEqual(mockLivro);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/livros",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    it("deve lançar erro com mensagem do servidor", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ erro: "Título é obrigatório" }),
      });

      const form = {
        titulo: "",
        autor: "Autor",
        genero: "Romance",
        ano: 2000,
        descricao: "",
        status: "QUERO_LER" as const,
      };

      await expect(livroService.criar(form)).rejects.toThrow("Título é obrigatório");
    });
  });

  describe("atualizar", () => {
    it("deve atualizar um livro existente", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockLivro, titulo: "Memórias Póstumas" }),
      });

      const form = {
        titulo: "Memórias Póstumas",
        autor: "Machado de Assis",
        genero: "Romance",
        ano: 1881,
        descricao: "",
        status: "LIDO" as const,
      };

      const result = await livroService.atualizar(1, form);

      expect(result.titulo).toBe("Memórias Póstumas");
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/livros/1",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  describe("deletar", () => {
    it("deve deletar um livro", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      await livroService.deletar(1);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/livros/1",
        { method: "DELETE" }
      );
    });

    it("deve lançar erro quando falha", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

      await expect(livroService.deletar(1)).rejects.toThrow("Erro ao deletar livro");
    });
  });

  describe("importar", () => {
    it("deve importar livros via endpoint batch", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [mockLivro],
      });

      const livros = [{ titulo: "Dom Casmurro", autor: "Machado de Assis" }];
      const result = await livroService.importar(livros);

      expect(result).toEqual([mockLivro]);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/livros/importar",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(livros),
        })
      );
    });
  });
});
