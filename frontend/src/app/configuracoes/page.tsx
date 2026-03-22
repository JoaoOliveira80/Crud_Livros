"use client";

import { useState, useEffect } from "react";
import { Livro } from "@/types/livros";
import { livroService } from "@/services/livroService";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";

export default function Configuracoes() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [aviso, setAviso] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function carregar() {
      try {
        const data = await livroService.listarTodos();
        setLivros(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const stats = {
    total: livros.length,
    lidos: livros.filter(l => l.status === "LIDO").length,
    lendo: livros.filter(l => l.status === "LENDO").length,
    queroLer: livros.filter(l => l.status === "QUERO_LER").length,
  };

  const mostrarAviso = (msg: string) => {
    setAviso(msg);
    setTimeout(() => setAviso(""), 3000);
  };

  return (
    <>
      <Header onNovo={() => window.location.href = "/"} onAviso={mostrarAviso} />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-5xl font-serif text-primary">Configurações</h1>
          <p className="text-on-surface-60 mt-3 text-lg italic">Personalize sua experiência e visualize suas estatísticas.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-surface-container-low p-8 rounded-2xl shadow-sm border border-outline-variant-10">
            <h2 className="text-2xl font-serif text-primary mb-6">Perfil do Curador</h2>
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-40">Nome de Exibição</label>
                <p className="text-lg font-medium text-on-surface mt-1">Leitor Entusiasta</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-40">Bio</label>
                <p className="text-sm text-on-surface-70 mt-1 leading-relaxed italic">
                  "Sempre carregando um livro, as vezes dois. Apaixonado por ficção científica e clássicos do realismo."
                </p>
              </div>
              <button onClick={() => mostrarAviso("Configurações de perfil salvas (mock)")} className="btn-secondary w-fit text-xs px-4 py-2 mt-2">
                Editar Perfil
              </button>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-2xl shadow-sm border border-outline-variant-10">
            <h2 className="text-2xl font-serif text-primary mb-6">Métricas da Estante</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-outline-variant/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-40">Total</span>
                <p className="text-3xl font-serif text-primary mt-1">{stats.total}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-outline-variant/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-40">Lidos</span>
                <p className="text-3xl font-serif text-secondary mt-1">{stats.lidos}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-outline-variant/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-40">Lendo</span>
                <p className="text-3xl font-serif text-primary-container mt-1">{stats.lendo}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-outline-variant/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-40">Desejos</span>
                <p className="text-3xl font-serif text-on-surface-60 mt-1">{stats.queroLer}</p>
              </div>
            </div>
          </section>

          <section className="md:col-span-2 bg-surface-container-low p-8 rounded-2xl shadow-sm border border-outline-variant-10">
            <h2 className="text-2xl font-serif text-primary mb-6">Preferências Visuais</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant-10">
                <div>
                  <p className="font-medium text-on-surface">Modo Escuro</p>
                  <p className="text-xs text-on-surface-50 mt-0.5">Ative para reduzir o cansaço visual.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-14 h-7 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-8' : 'translate-x-1'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant-10">
                <div>
                  <p className="font-medium text-on-surface">Idioma da Interface</p>
                </div>
                <span className="text-xs font-bold text-primary uppercase">Português (BR)</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {aviso && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
          <span className="text-sm font-medium">{aviso}</span>
          <button onClick={() => setAviso("")} className="text-white-60 hover:text-white">✕</button>
        </div>
      )}
    </>
  );
}
