"use client";

import { useState, useEffect, useCallback } from "react";
import { Livro, LivroForm } from "@/types/livros";
import { livroService } from "@/services/livroService";
import Header from "@/components/Header";
import LivroCard from "@/components/LivroCard";
import LivroModal from "@/components/LivroModal";

export default function Home() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [livroDeletando, setLivroDeletando] = useState<Livro | null>(null);
  const [busca, setBusca] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [aviso, setAviso] = useState("");

  const carregarLivros = useCallback(async () => {
    try {
      setLoading(true);
      const data = await livroService.listarTodos();
      setLivros(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarLivros();
  }, [carregarLivros]);

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
      setLivros((prev) =>
        prev.map((l) => (l.id === livroEditando.id ? atualizado : l)),
      );
    } else {
      const criado = await livroService.criar(dados);
      setLivros((prev) => [criado, ...prev]);
    }
    fecharModal();
  };

  const mostrarAviso = (msg: string) => {
    setAviso(msg);
    setTimeout(() => setAviso(""), 3000);
  };

  const prepararDelecao = (id: number) => {
    const livro = livros.find((l) => l.id === id);
    if (livro) setLivroDeletando(livro);
  };

  const confirmarDelecao = async () => {
    if (!livroDeletando) return;
    try {
      await livroService.deletar(livroDeletando.id);
      setLivros((prev) => prev.filter((l) => l.id !== livroDeletando.id));
      setLivroDeletando(null);
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar o livro. Tente novamente.");
    }
  };

  const livrosFiltrados = livros.filter((l) => {
    const matchesBusca =
      l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      l.autor.toLowerCase().includes(busca.toLowerCase());
    const matchesGenero = generoFiltro === "" || l.genero === generoFiltro;
    return matchesBusca && matchesGenero;
  });

  const generos = Array.from(new Set(livros.map((l) => l.genero)));

  const queroLer = livrosFiltrados.filter((l) => l.status === "QUERO_LER");
  const lendo = livrosFiltrados.filter((l) => l.status === "LENDO");
  const lidos = livrosFiltrados.filter((l) => l.status === "LIDO");

  return (
    <>
      <Header onNovo={abrirNovo} onAviso={mostrarAviso} />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-on-surface/40 font-serif italic text-xl">
            Preparando curadoria...
          </div>
        ) : livros.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-on-surface/30">
            <span className="text-7xl font-serif italic">The empty shelf.</span>
            <p className="max-w-md text-center font-medium leading-relaxed">
              Explore sua coleção pessoal e acompanhe sua jornada literária.
              Cada livro é uma janela para um novo mundo.
            </p>
            <button onClick={abrirNovo} className="btn-primary mt-4">
              Adicionar o primeiro volume
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            <header className="max-w-3xl">
              <h2 className="text-[3.5rem] font-serif leading-[1.1] text-primary tracking-tight">
                Boa leitura,
                <br />
                <span className="italic">A curadoria é uma arte.</span>
              </h2>
              <p className="text-on-surface/60 mt-6 leading-relaxed text-lg">
                Explore sua coleção pessoal e acompanhe sua jornada literária.
                Sua estante agora conta com{" "}
                <span className="text-primary font-bold">{livros.length}</span>{" "}
                volumes catalogados.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex-1 min-w-70">
                  <input
                    type="text"
                    placeholder="Buscar por título ou autor..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <select
                  value={generoFiltro}
                  onChange={(e) => setGeneroFiltro(e.target.value)}
                  aria-label="Filtrar por gênero"
                  className="bg-surface-container-low border border-outline-variant/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/30 transition-colors cursor-pointer"
                >
                  <option value="">Todos os Gêneros</option>
                  {generos.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>

                {(busca !== "" || generoFiltro !== "") && (
                  <button
                    onClick={() => {
                      setBusca("");
                      setGeneroFiltro("");
                    }}
                    className="text-xs font-bold uppercase tracking-widest text-primary hover:underline px-2"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            </header>

            <div className="flex flex-col gap-20">
              {lendo.length > 0 && (
                <section>
                  <div className="flex items-baseline justify-between mb-8">
                    <h3 className="text-2xl font-serif text-primary">
                      Atualmente Lendo
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/30">
                      {lendo.length} ATIVOS
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
                    <section>
                      <div className="flex items-baseline justify-between mb-8">
                        <h3 className="text-2xl font-serif text-primary">
                          Próximos da Lista
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/30">
                          {queroLer.length} DESEJOS
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
                    Ações Rápidas
                  </h3>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={abrirNovo}
                      className="btn-primary w-full text-sm"
                    >
                      + Novo Volume
                    </button>
                    <button
                      onClick={() =>
                        mostrarAviso("Funcionalidade em desenvolvimento")
                      }
                      className="btn-secondary w-full text-sm"
                    >
                      Ver Biblioteca
                    </button>
                  </div>

                  {lidos.length > 0 && (
                    <div className="mt-12">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface/30 mb-4">
                        Recentemente Concluídos
                      </h4>
                      <div className="flex flex-col gap-6">
                        {lidos.slice(0, 3).map((l) => (
                          <div key={l.id} className="group cursor-pointer">
                            <p className="text-sm font-serif text-primary truncate group-hover:text-primary-container transition-colors">
                              {l.titulo}
                            </p>
                            <p className="text-[10px] text-on-surface/40 uppercase mt-0.5">
                              {l.autor}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>

              {lidos.length > 3 && (
                <section>
                  <div className="flex items-baseline justify-between mb-8">
                    <h3 className="text-2xl font-serif text-primary">
                      Histórico de Leitura
                    </h3>
                    <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                      Ver Todos
                    </button>
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
        <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-ambient max-w-sm w-full flex flex-col gap-6 transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-2xl font-serif text-primary">
                Remover Volume?
              </h3>
              <p className="text-on-surface/60 text-sm leading-relaxed">
                Você está prestes a remover{" "}
                <span className="font-bold text-primary italic">
                  &quot;{livroDeletando.titulo}&quot;
                </span>{" "}
                da sua estante. Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmarDelecao}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors text-sm"
              >
                Confirmar Remoção
              </button>
              <button
                onClick={() => setLivroDeletando(null)}
                className="btn-secondary w-full text-sm"
              >
                Manter na Coleção
              </button>
            </div>
          </div>
        </div>
      )}
      {aviso && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
          <span className="text-sm font-medium">{aviso}</span>
          <button
            onClick={() => setAviso("")}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
