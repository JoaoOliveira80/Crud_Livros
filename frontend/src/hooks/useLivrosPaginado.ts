import { useState, useEffect, useCallback } from "react";
import { Livro, PageResponse } from "@/types/livros";
import { livroService } from "@/services/livroService";

const DEFAULT_PAGE_SIZE = 12;

interface UseLivrosPaginadoOptions {
  page: number;
  pageSize?: number;
  busca?: string;
  genero?: string;
  status?: string;
}

export function useLivrosPaginado({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  busca,
  genero,
  status,
}: UseLivrosPaginadoOptions) {
  const [pageData, setPageData] = useState<PageResponse<Livro> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await livroService.listarPaginado(
        page,
        pageSize,
        "createdAt",
        "desc",
        busca || undefined,
        genero || undefined,
        status || undefined,
      );
      setPageData(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar livros. Tente novamente.");
      setPageData(null);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, busca, genero, status]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return {
    pageData,
    livros: pageData?.content ?? [],
    totalElements: pageData?.totalElements ?? 0,
    totalPages: pageData?.totalPages ?? 1,
    loading,
    error,
    recarregar,
    setPageData,
  };
}
