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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors";

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onFechar}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">
            {livro ? "Editar Livro" : "Novo Livro"}
          </h2>
          <button
            onClick={onFechar}
            className="text-zinc-500 hover:text-zinc-200 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {erro && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
            {erro}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">
              Título *
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
            <label className="text-xs text-zinc-400 uppercase tracking-wide">
              Autor *
            </label>
            <input
              name="autor"
              value={form.autor}
              onChange={handleChange}
              placeholder="Ex: Machado de Assis"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 uppercase tracking-wide">
                Gênero *
              </label>
              <input
                name="genero"
                value={form.genero}
                onChange={handleChange}
                placeholder="Ex: Romance"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 uppercase tracking-wide">
                Ano *
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
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status-select"
              className="text-xs text-zinc-400 uppercase tracking-wide"
            >
              Status
            </label>
            <select
              id="status-select"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="QUERO_LER">Quero Ler</option>
              <option value="LENDO">Lendo</option>
              <option value="LIDO">Lido</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Uma breve sinopse..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onFechar}
            className="text-sm text-zinc-400 border border-zinc-700 px-4 py-2 rounded-lg hover:text-zinc-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={salvando}
            className="text-sm font-medium bg-emerald-400 text-zinc-950 px-4 py-2 rounded-lg hover:bg-emerald-300 transition-colors disabled:opacity-50"
          >
            {salvando ? "Salvando..." : livro ? "Salvar" : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}
