"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Livro, LivroForm } from "@/types/livros";
import { livroService } from "@/services/livroService";
import { useToast } from "@/hooks/useToast";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLivrosPaginado } from "@/hooks/useLivrosPaginado";
import { generosParaSelect } from "@/constants/generos";
import Header from "@/components/Header";
import LivroCard from "@/components/LivroCard";
import LivroModal from "@/components/LivroModal";
import Toast from "@/components/Toast";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonCards from "@/components/SkeletonCards";
import LivrosFiltros from "@/components/LivrosFiltros";
import Pagination from "@/components/Pagination";

function BibliotecaConteudo() {
  const searchParams = useSearchParams();
  const [pagina, setPagina] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [livroDeletando, setLivroDeletando] = useState<Livro | null>(null);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState(
    () => searchParams.get("status") ?? "",
  );
  const [generoFiltro, setGeneroFiltro] = useState("");
  const { aviso, mostrarAviso, fecharAviso } = useToast();

  const buscaDebounced = useDebouncedValue(busca, 300);

  useEffect(() => {
    setPagina(0);
  }, [buscaDebounced, statusFiltro, generoFiltro]);

  const {
    livros,
    totalElements,
    totalPages,
    loading,
    error,
    setPageData,
  } = useLivrosPaginado({
    page: pagina,
    busca: buscaDebounced,
    genero: generoFiltro,
    status: statusFiltro,
  });

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
      const atualizado = await livroService.atualizar(
        livroEditando.id,
        dados,
      );
      setPageData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((l) =>
            l.id === livroEditando.id ? atualizado : l,
          ),
        };
      });
      mostrarAviso("Volume atualizado com sucesso!");
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
      mostrarAviso("Volume catalogado com sucesso!");
    }
    fecharModal();
  };

  const prepararDelecao = (id: number) => {
    const livro = livros.find((l) => l.id === id);
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
      mostrarAviso("Volume removido da estante.");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      mostrarAviso("Erro ao deletar o livro. Tente novamente.");
    }
  };

  const generos = generosParaSelect(livros.map((l) => l.genero));
  const temFiltro = Boolean(buscaDebounced || statusFiltro || generoFiltro);

  const limparFiltros = () => {
    setBusca("");
    setStatusFiltro("");
    setGeneroFiltro("");
    setPagina(0);
  };

  return (
    <>
      <Header onNovo={abrirNovo} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="flex flex-col gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-serif text-primary">Biblioteca</h1>
            <p className="text-on-surface-60 mt-3 text-lg italic">
              {totalElements} volume{totalElements !== 1 ? "s" : ""} catalogado
              {totalElements !== 1 ? "s" : ""}.
            </p>
          </div>

          <LivrosFiltros
            busca={busca}
            onBuscaChange={setBusca}
            generoFiltro={generoFiltro}
            onGeneroChange={(v) => {
              setGeneroFiltro(v);
              setPagina(0);
            }}
            generos={generos}
            statusFiltro={statusFiltro}
            onStatusChange={(v) => {
              setStatusFiltro(v);
              setPagina(0);
            }}
            onLimpar={limparFiltros}
            temFiltro={temFiltro}
            placeholder="Buscar por título ou autor..."
          />
        </header>

        {error && (
          <p className="text-sm text-error bg-error-container border border-error-container px-4 py-3 rounded-lg mb-8">
            {error}
          </p>
        )}

        {loading ? (
          <SkeletonCards count={8} />
        ) : livros.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-6">
            <p className="text-on-surface-30 italic text-lg">
              Nenhum volume encontrado
              {temFiltro ? " com os filtros atuais." : "."}
            </p>
            {!temFiltro && (
              <Button onClick={abrirNovo} variant="primary">
                Adicionar o primeiro volume
              </Button>
            )}
            {temFiltro && (
              <Button onClick={limparFiltros} variant="secondary">
                Limpar filtros
              </Button>
            )}
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

        <Pagination
          pagina={pagina}
          totalPages={totalPages}
          onPaginaChange={setPagina}
        />
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
          titulo="Remover volume?"
          mensagem={
            <>
              Você está prestes a remover{" "}
              <span className="font-bold text-primary italic">
                &quot;{livroDeletando.titulo}&quot;
              </span>{" "}
              da sua estante.
            </>
          }
          textoConfirmar="Confirmar remoção"
          textoCancelar="Manter na coleção"
          onConfirmar={confirmarDelecao}
          onCancelar={() => setLivroDeletando(null)}
        />
      )}

      <Toast aviso={aviso} onFechar={fecharAviso} />
    </>
  );
}

export default function Biblioteca() {
  return (
    <Suspense fallback={<SkeletonCards count={8} />}>
      <BibliotecaConteudo />
    </Suspense>
  );
}
