"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Livro, LivroForm } from "@/types/livros";
import { livroService } from "@/services/livroService";
import { useToast } from "@/hooks/useToast";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLivrosLista } from "@/hooks/useLivrosLista";
import { generosParaSelect } from "@/constants/generos";
import Header from "@/components/Header";
import LivroCard from "@/components/LivroCard";
import LivroModal from "@/components/LivroModal";
import Toast from "@/components/Toast";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ConfirmModal";
import SkeletonCards from "@/components/SkeletonCards";
import LivrosFiltros from "@/components/LivrosFiltros";

export default function Home() {
  const [modalAberto, setModalAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [livroDeletando, setLivroDeletando] = useState<Livro | null>(null);
  const [busca, setBusca] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [importando, setImportando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { aviso, mostrarAviso, fecharAviso } = useToast();

  const buscaDebounced = useDebouncedValue(busca, 300);
  const { livros, totalElements, loading, error, recarregar } = useLivrosLista({
    busca: buscaDebounced,
    genero: generoFiltro,
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
      await livroService.atualizar(livroEditando.id, dados);
      mostrarAviso("Volume atualizado com sucesso!");
    } else {
      await livroService.criar(dados);
      mostrarAviso("Volume catalogado com sucesso!");
    }
    await recarregar();
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
      await recarregar();
      setLivroDeletando(null);
      mostrarAviso("Volume removido da estante.");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      mostrarAviso("Erro ao deletar o livro. Tente novamente.");
    }
  };

  const generos = generosParaSelect(livros.map((l) => l.genero));
  const temFiltro = busca !== "" || generoFiltro !== "";

  const limparFiltros = () => {
    setBusca("");
    setGeneroFiltro("");
  };

  const exportarJSON = async () => {
    try {
      const todos = await livroService.listarTodos();
      const dataStr = JSON.stringify(todos, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `minha-estante-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      mostrarAviso(`${todos.length} volumes exportados com sucesso!`);
    } catch (err) {
      console.error(err);
      mostrarAviso("Erro ao exportar biblioteca. Tente novamente.");
    }
  };

  const importarJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportando(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const livrosImport = Array.isArray(parsed) ? parsed : [parsed];
      const criados = await livroService.importar(livrosImport);
      await recarregar();
      mostrarAviso(`${criados.length} livros importados com sucesso!`);
    } catch (err) {
      console.error("Erro ao importar:", err);
      mostrarAviso("Erro ao importar arquivo. Verifique o formato.");
    } finally {
      setImportando(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const queroLer = livros.filter((l) => l.status === "QUERO_LER");
  const lendo = livros.filter((l) => l.status === "LENDO");
  const lidos = livros.filter((l) => l.status === "LIDO");

  return (
    <>
      <Header onNovo={abrirNovo} />

      <main className="max-w-5xl mx-auto content-area">
        {loading ? (
          <SkeletonCards count={6} />
        ) : livros.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-on-surface-30">
            <span className="text-7xl font-serif italic text-center">
              A estante está vazia.
            </span>
            <p className="max-w-md text-center font-medium leading-relaxed">
              {temFiltro
                ? "Nenhum volume corresponde aos filtros. Tente outros termos ou limpe a busca."
                : "Explore sua coleção pessoal e acompanhe sua jornada literária. Cada livro é uma janela para um novo mundo."}
            </p>
            <div className="flex items-center gap-4 mt-4 flex-wrap justify-center">
              {temFiltro ? (
                <Button onClick={limparFiltros} variant="secondary">
                  Limpar filtros
                </Button>
              ) : (
                <>
                  <Button onClick={abrirNovo} variant="primary">
                    Adicionar o primeiro volume
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    loading={importando}
                    aria-busy={importando}
                  >
                    {importando ? "Importando..." : "Importar biblioteca"}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {error && (
              <p className="text-sm text-error bg-error-container border border-error-container px-4 py-3 rounded-lg">
                {error}
              </p>
            )}

            <header className="max-w-3xl">
              <h2 className="text-[3.5rem] font-serif leading-[1.1] text-primary tracking-tight">
                Boa leitura,
                <br />
                <span className="italic">A curadoria é uma arte.</span>
              </h2>
              <p className="lead mt-6 leading-relaxed text-lg">
                Explore sua coleção pessoal e acompanhe sua jornada literária.
                Sua estante agora conta com{" "}
                <span className="text-primary font-bold">{totalElements}</span>{" "}
                volume{totalElements !== 1 ? "s" : ""} catalogado
                {totalElements !== 1 ? "s" : ""}.
              </p>

              <div className="mt-8">
                <LivrosFiltros
                  busca={busca}
                  onBuscaChange={setBusca}
                  generoFiltro={generoFiltro}
                  onGeneroChange={setGeneroFiltro}
                  generos={generos}
                  onLimpar={limparFiltros}
                  temFiltro={temFiltro}
                />
              </div>
            </header>

            <div className="flex flex-col gap-20">
              {lendo.length > 0 && (
                <section aria-labelledby="secao-lendo">
                  <div className="flex items-baseline justify-between mb-8">
                    <h3
                      id="secao-lendo"
                      className="text-2xl font-serif text-primary"
                    >
                      Atualmente lendo
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-30">
                      {lendo.length} ativo{lendo.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lendo.map((l) => (
                      <LivroCard
                        key={l.id}
                        livro={l}
                        onEditar={abrirEditar}
                        onDeletar={prepararDelecao}
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                  {queroLer.length > 0 && (
                    <section aria-labelledby="secao-quero-ler">
                      <div className="flex items-baseline justify-between mb-8">
                        <h3
                          id="secao-quero-ler"
                          className="text-2xl font-serif text-primary"
                        >
                          Próximos da lista
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-30">
                          {queroLer.length} desejo
                          {queroLer.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {queroLer.map((l) => (
                          <LivroCard
                            key={l.id}
                            livro={l}
                            onEditar={abrirEditar}
                            onDeletar={prepararDelecao}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <aside className="lg:col-span-4 bg-surface-container-low p-8 rounded-2xl h-fit sticky top-28">
                  <h3 className="text-xl font-serif text-primary mb-6">
                    Ações rápidas
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={abrirNovo}
                      variant="primary"
                      className="w-full text-sm"
                    >
                      + Novo volume
                    </Button>
                    <Button
                      onClick={exportarJSON}
                      variant="secondary"
                      className="w-full text-sm"
                    >
                      ↓ Exportar biblioteca
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="secondary"
                      className="w-full text-sm"
                      loading={importando}
                      aria-busy={importando}
                    >
                      {importando ? "Importando..." : "↑ Importar biblioteca"}
                    </Button>
                  </div>

                  {lidos.length > 0 && (
                    <div className="mt-12">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-30 mb-4">
                        Recentemente concluídos
                      </h4>
                      <div className="flex flex-col gap-6">
                        {lidos.slice(0, 3).map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => abrirEditar(l)}
                            className="group text-left cursor-pointer focus-ring rounded"
                          >
                            <p className="text-sm font-serif text-primary truncate group-hover:text-on-primary-container transition-colors">
                              {l.titulo}
                            </p>
                            <p className="text-[10px] text-on-surface-40 uppercase mt-0.5">
                              {l.autor}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>

              {lidos.length > 3 && (
                <section aria-labelledby="secao-lidos">
                  <div className="flex items-baseline justify-between mb-8">
                    <h3
                      id="secao-lidos"
                      className="text-2xl font-serif text-primary"
                    >
                      Histórico de leitura
                    </h3>
                    <Link
                      href="/biblioteca?status=LIDO"
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      Ver todos
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {lidos.slice(3).map((l) => (
                      <LivroCard
                        key={l.id}
                        livro={l}
                        onEditar={abrirEditar}
                        onDeletar={prepararDelecao}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
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
          titulo="Remover volume?"
          mensagem={
            <>
              Você está prestes a remover{" "}
              <span className="font-bold text-primary italic">
                &quot;{livroDeletando.titulo}&quot;
              </span>{" "}
              da sua estante. Esta ação não pode ser desfeita.
            </>
          }
          textoConfirmar="Confirmar remoção"
          textoCancelar="Manter na coleção"
          onConfirmar={confirmarDelecao}
          onCancelar={() => setLivroDeletando(null)}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        aria-label="Selecionar arquivo JSON para importar"
        title="Selecionar arquivo JSON para importar"
        onChange={importarJSON}
        className="hidden"
      />

      <Toast aviso={aviso} onFechar={fecharAviso} />
    </>
  );
}
