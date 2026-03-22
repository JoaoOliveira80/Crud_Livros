"use client";

import { useState, useEffect, useCallback } from "react";
import { Livro, LivroForm } from "@/types/livros";
import { livroService } from "@/services/livroService";
import Header from "@/components/Header";
import LivroCard from "@/components/LivroCard";
import LivroModal from "@/components/LivroModal";

export default function Biblioteca() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [livroDeletando, setLivroDeletando] = useState<Livro | null>(null);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
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

  const prepararDelecao = (id: number) => {
    const livro = livros.find(l => l.id === id);
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

  const mostrarAviso = (msg: string) => {
    setAviso(msg);
    setTimeout(() => setAviso(""), 3000);
  };

  const livrosFiltrados = livros.filter((l) => {
    const matchesBusca = 
      l.titulo.toLowerCase().includes(busca.toLowerCase()) || 
      l.autor.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = statusFiltro === "" || l.status === statusFiltro;
    const matchesGenero = generoFiltro === "" || l.genero === generoFiltro;
    return matchesBusca && matchesStatus && matchesGenero;
  });

  const generos = Array.from(new Set(livros.map((l) => l.genero)));

  return (
    <>
      <Header onNovo={abrirNovo} onAviso={mostrarAviso} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-serif text-primary">Biblioteca</h1>
            <p className="text-on-surface/60 mt-3 text-lg italic">Catalogação completa da sua jornada literária.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/30 min-w-[200px]"
            />
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/15 rounded-lg px-4 py-2 text-sm focus:outline-none cursor-pointer"
            >
              <option value="">Todos os Status</option>
              <option value="QUERO_LER">Quero Ler</option>
              <option value="LENDO">Lendo</option>
              <option value="LIDO">Lido</option>
            </select>
            <select
              value={generoFiltro}
              onChange={(e) => setGeneroFiltro(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/15 rounded-lg px-4 py-2 text-sm focus:outline-none cursor-pointer"
            >
              <option value="">Todos os Gêneros</option>
              {generos.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center font-serif italic text-xl text-on-surface/40">Sincronizando biblioteca...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {livrosFiltrados.map((l) => (
              <LivroCard
                key={l.id}
                livro={l}
                onEditar={abrirEditar}
                onDeletar={prepararDelecao}
              />
            ))}
            {livrosFiltrados.length === 0 && (
              <div className="col-span-full py-20 text-center text-on-surface/30 italic">
                Nenhum volume encontrado com os filtros atuais.
              </div>
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

      {livroDeletando && (
        <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-ambient max-w-sm w-full flex flex-col gap-6 transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-2xl font-serif text-primary">Remover Volume?</h3>
              <p className="text-on-surface/60 text-sm leading-relaxed">
                Você está prestes a remover <span className="font-bold text-primary italic">"{livroDeletando.titulo}"</span> da sua estante.
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
          <button onClick={() => setAviso("")} className="text-white/60 hover:text-white">✕</button>
        </div>
      )}
    </>
  );
}
