"use client";

import { useState, useEffect } from "react";
import { Livro, LivroForm, Status } from "../types/livros";

interface LivroModalProps {
  livro: Livro | null;
  onSalvar: (dados: LivroForm) => Promise<void>;
  onFechar: () => void;
}

const formInicial: LivroForm = {
  titulo: "",
  autor: "",
  genero: "",
  ano: "",
  descricao: "",
  status: "QUERO_LER",
  avaliacao: undefined,
};

export default function LivroModal({
  livro,
  onSalvar,
  onFechar,
}: LivroModalProps) {
  const [form, setForm] = useState<LivroForm>(formInicial);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (livro) {
      setForm({
        titulo: livro.titulo,
        autor: livro.autor,
        genero: livro.genero,
        ano: livro.ano,
        descricao: livro.descricao || "",
        status: livro.status,
        avaliacao: livro.avaliacao,
      });
    } else {
      setForm(formInicial);
    }
    setErro("");
  }, [livro]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "ano") {
      setForm((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
    } else if (name === "status") {
      setForm((prev) => ({
        ...prev,
        status: value as Status,
        avaliacao: value === "LIDO" ? prev.avaliacao : undefined,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvaliacao = (value: number) => {
    setForm((prev) => ({ ...prev, avaliacao: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.titulo.trim() ||
      !form.autor.trim() ||
      !form.genero.trim() ||
      !form.ano
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setSalvando(true);
    try {
      await onSalvar(form);
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : "Ocorreu um erro ao salvar.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant/15 rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/30 transition-colors font-sans";

  return (
    <div
      className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onFechar}
    >
      <div
        className="bg-surface border-none shadow-ambient rounded-2xl w-full max-w-lg p-8 flex flex-col gap-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl text-primary">
              {livro ? "Editar Livro" : "Novo Livro"}
            </h2>
            <p className="text-xs font-sans uppercase tracking-widest text-on-surface/40 mt-1">
              Curadoria da sua Estante Digital
            </p>
          </div>
          <button
            onClick={onFechar}
            className="text-on-surface/40 hover:text-on-surface transition-colors p-2"
          >
            <span className="text-2xl leading-none">✕</span>
          </button>
        </div>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            {erro}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest ml-1">
              Título do Volume
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ex: Dom Casmurro"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest ml-1">
              Escrito por
            </label>
            <input
              name="autor"
              value={form.autor}
              onChange={handleChange}
              placeholder="Ex: Machado de Assis"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest ml-1">
              Gênero Literário
            </label>
            <input
              name="genero"
              value={form.genero}
              onChange={handleChange}
              placeholder="Ex: Realismo"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest ml-1">
              Ano de Lançamento
            </label>
            <input
              name="ano"
              type="number"
              value={form.ano}
              onChange={handleChange}
              placeholder="Ex: 1899"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status-select"
              className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest ml-1"
            >
              Status de Leitura
            </label>
            <select
              id="status-select"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="QUERO_LER">Quero Ler</option>
              <option value="LENDO">Lendo</option>
              <option value="LIDO">Lido</option>
            </select>
          </div>

          {form.status === "LIDO" && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest ml-1">
                Avaliação
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleAvaliacao(star)}
                    className="p-1 transition-transform hover:scale-110"
                    aria-label={`Avaliar com ${star} estrela${star > 1 ? "s" : ""}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill={star <= (form.avaliacao || 0) ? "#eab308" : "none"}
                      stroke={star <= (form.avaliacao || 0) ? "#eab308" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={star <= (form.avaliacao || 0) ? "text-yellow-500" : "text-on-surface/30"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
                {form.avaliacao !== undefined && (
                  <button
                    type="button"
                    onClick={() => handleAvaliacao(0)}
                    className="text-xs text-on-surface/50 hover:text-red-500 ml-2"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest ml-1">
              Breves Anotações
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Impressões sobre o livro..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onFechar}
            className="btn-secondary"
          >
            Manter na estante
          </button>
          <button
            onClick={handleSubmit}
            disabled={salvando}
            className="btn-primary min-w-[140px]"
          >
            {salvando ? "Curando..." : livro ? "Salvar Volume" : "Catalogar Livro"}
          </button>
        </div>
      </div>
    </div>
  );
}
