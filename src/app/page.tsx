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

  const handleDeletar = async (id: number) => {
    if (!confirm("Deletar este livro?")) return;
    await livroService.deletar(id);
    setLivros((prev) => prev.filter((l) => l.id !== id));
  };

  const queroLer = livros.filter((l) => l.status === "QUERO_LER");
  const lendo = livros.filter((l) => l.status === "LENDO");
  const lidos = livros.filter((l) => l.status === "LIDO");

  return (
    <>
      <Header onNovo={abrirNovo} />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            Carregando...
          </div>
        ) : livros.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
            <span className="text-4xl">◇</span>
            <p>Nenhum livro cadastrado ainda.</p>
            <button
              onClick={abrirNovo}
              className="text-sm text-emerald-400 hover:underline"
            >
              Adicionar o primeiro
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {lendo.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-amber-400 uppercase tracking-widest mb-4">
                  Lendo agora — {lendo.length}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lendo.map((l) => (
                    <LivroCard
                      key={l.id}
                      livro={l}
                      onEditar={abrirEditar}
                      onDeletar={handleDeletar}
                    />
                  ))}
                </div>
              </section>
            )}
            {queroLer.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-blue-400 uppercase tracking-widest mb-4">
                  Quero Ler — {queroLer.length}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {queroLer.map((l) => (
                    <LivroCard
                      key={l.id}
                      livro={l}
                      onEditar={abrirEditar}
                      onDeletar={handleDeletar}
                    />
                  ))}
                </div>
              </section>
            )}
            {lidos.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-4">
                  Lidos — {lidos.length}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lidos.map((l) => (
                    <LivroCard
                      key={l.id}
                      livro={l}
                      onEditar={abrirEditar}
                      onDeletar={handleDeletar}
                    />
                  ))}
                </div>
              </section>
            )}
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
    </>
  );
}
