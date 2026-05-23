import { useState, useEffect, useCallback } from "react";
import { Livro } from "@/types/livros";
import { livroService } from "@/services/livroService";

const DASHBOARD_PAGE_SIZE = 500;

interface UseLivrosListaOptions {
  busca?: string;
  genero?: string;
  enabled?: boolean;
}

export function useLivrosLista({
  busca,
  genero,
  enabled = true,
}: UseLivrosListaOptions) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await livroService.listarPaginado(
        0,
        DASHBOARD_PAGE_SIZE,
        "createdAt",
        "desc",
        busca || undefined,
        genero || undefined,
      );
      setLivros(data.content);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar livros. Tente novamente.");
      setLivros([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [busca, genero, enabled]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { livros, totalElements, loading, error, recarregar, setLivros };
}
