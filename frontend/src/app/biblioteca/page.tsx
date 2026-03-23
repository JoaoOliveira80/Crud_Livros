"use client";

import { useState, useEffect, useCallback } from "react";
import { Livro, LivroForm, PageResponse } from "@/types/livros";
import { livroService } from "@/services/livroService";
import { useToast } from "@/hooks/useToast";
import Header from "@/components/Header";
import LivroCard from "@/components/LivroCard";
import LivroModal from "@/components/LivroModal";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonCards from "@/components/SkeletonCards";

const PAGE_SIZE = 12;

export default function Biblioteca() {
  const [pageData, setPageData] = useState<PageResponse<Livro> | null>(null);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [livroDeletando, setLivroDeletando] = useState<Livro | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaAtual, setBuscaAtual] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const { aviso, mostrarAviso, fecharAviso } = useToast();

  const carregarLivros = useCallback(async () => {
    try {
      setLoading(true);
      const data = await livroService.listarPaginado(
        pagina,
        PAGE_SIZE,
        "createdAt",
        "desc",
        buscaAtual || undefined,
        generoFiltro || undefined,
        statusFiltro || undefined
      );
      setPageData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagina, buscaAtual, statusFiltro, generoFiltro]);

  useEffect(() => {
    carregarLivros();
  }, [carregarLivros]);

  const aplicarBusca = () => {
    setPagina(0);
    setBuscaAtual(busca);
  };

  const limparFiltros = () => {
    setBusca("");
    setBuscaAtual("");
    setStatusFiltro("");
    setGeneroFiltro("");
    setPagina(0);
  };

  const abrirNovo = () => {
    setLivroEditando(null);
    setModalAberto(true);
  };

  const abrirEditar = (livro: Livro) => {
    setLivroEditando(livro);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setLivroEditando(null);
  };

  const handleSalvar = async (dados: LivroForm) => {
    if (livroEditando) {
      const atualizado = await livroService.atualizar(livroEditando.id, dados);
      setPageData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((l) =>
            l.id === livroEditando.id ? atualizado : l
          ),
        };
      });
    } else {
      const criado = await livroService.criar(dados);
      setPageData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: [criado, ...prev.content],
          totalElements: prev.totalElements + 1,
        };
      });
    }
    fecharModal();
  };

  const prepararDelecao = (id: number) => {
    const livro = pageData?.content.find((l) => l.id === id);
    if (livro) setLivroDeletando(livro);
  };

  const confirmarDelecao = async () => {
    if (!livroDeletando) return;
    try {
      await livroService.deletar(livroDeletando.id);
      setPageData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.filter((l) => l.id !== livroDeletando.id),
          totalElements: prev.totalElements - 1,
        };
      });
      setLivroDeletando(null);
    } catch (err) {
      console.error("Erro ao deletar:", err);
      mostrarAviso("Erro ao deletar o livro. Tente novamente.");
    }
  };

  const livros = pageData?.content || [];
  const totalPages = pageData?.totalPages || 1;
  const totalElements = pageData?.totalElements || 0;
  const temFiltro = buscaAtual || statusFiltro || generoFiltro;

  return (
    <>
      <Header onNovo={abrirNovo} onAviso={mostrarAviso} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-serif text-primary">Biblioteca</h1>
            <p className="text-on-surface-60 mt-3 text-lg italic">
              {totalElements} volume{totalElements !== 1 ? "s" : ""} catalogado{totalElements !== 1 ? "s" : ""}.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && aplicarBusca()}
                className="bg-surface-container-low border border-outline-variant-15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-30 min-w-50"
              />
              <button
                onClick={aplicarBusca}
                className="btn-primary text-xs px-4 py-2"
              >
                Buscar
              </button>
            </div>
            <select
              value={statusFiltro}
              onChange={(e) => {
                setStatusFiltro(e.target.value);
                setPagina(0);
              }}
              aria-label="Filtrar por status"
              className="bg-surface-container-low border border-outline-variant-15 rounded-lg px-4 py-2 text-sm focus:outline-none cursor-pointer"
            >
              <option value="">Todos os Status</option>
              <option value="QUERO_LER">Quero Ler</option>
              <option value="LENDO">Lendo</option>
              <option value="LIDO">Lido</option>
            </select>
            <select
              value={generoFiltro}
              onChange={(e) => {
                setGeneroFiltro(e.target.value);
                setPagina(0);
              }}
              aria-label="Filtrar por gênero"
              className="bg-surface-container-low border border-outline-variant-15 rounded-lg px-4 py-2 text-sm focus:outline-none cursor-pointer"
            >
              <option value="">Todos os Gêneros</option>
              <option value="Ficção">Ficção</option>
              <option value="Não-ficção">Não-ficção</option>
              <option value="Fantasia">Fantasia</option>
              <option value="Romance">Romance</option>
              <option value="Terror">Terror</option>
              <option value="Ficção Científica">Ficção Científica</option>
              <option value="Biografia">Biografia</option>
              <option value="História">História</option>
              <option value="Poesia">Poesia</option>
              <option value="Outro">Outro</option>
            </select>
            {temFiltro && (
              <button
                onClick={limparFiltros}
                className="text-xs font-bold uppercase tracking-widest text-primary hover:underline px-2"
              >
                Limpar
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <SkeletonCards count={8} />
        ) : livros.length === 0 ? (
          <div className="py-20 text-center text-on-surface-30 italic">
            Nenhum volume encontrado{temFiltro ? " com os filtros atuais." : "."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {livros.map((l) => (
              <LivroCard
                key={l.id}
                livro={l}
                onEditar={abrirEditar}
                onDeletar={prepararDelecao}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => setPagina((p) => Math.max(0, p - 1))}
              disabled={pagina === 0}
              className="px-4 py-2 rounded-lg border border-outline-variant-15 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-on-surface-60 px-4">
              {pagina + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pagina >= totalPages - 1}
              className="px-4 py-2 rounded-lg border border-outline-variant-15 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
            >
              Próxima
            </button>
          </div>
        )}
      </main>

      {modalAberto && (
        <LivroModal
          livro={livroEditando}
          onSalvar={handleSalvar}
          onFechar={fecharModal}
        />
      )}

      {livroDeletando && (
        <ConfirmModal
          titulo="Remover Volume?"
          mensagem={
            <>
              Você está prestes a remover{" "}
              <span className="font-bold text-primary italic">
                &quot;{livroDeletando.titulo}&quot;
              </span>{" "}
              da sua estante.
            </>
          }
          textoConfirmar="Confirmar Remoção"
          textoCancelar="Manter na Coleção"
          onConfirmar={confirmarDelecao}
          onCancelar={() => setLivroDeletando(null)}
        />
      )}

      <Toast aviso={aviso} onFechar={fecharAviso} />
    </>
  );
}
