"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Button from "@/components/ui/Button";
import { GENEROS_LITERARIOS } from "@/constants/generos";
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

function validateField(name: string, value: unknown): string {
  switch (name) {
    case "titulo":
      return !String(value).trim() ? "Título é obrigatório" : "";
    case "autor":
      return !String(value).trim() ? "Autor é obrigatório" : "";
    case "genero":
      return !String(value).trim() ? "Gênero é obrigatório" : "";
    case "ano":
      if (value === "" || value === undefined) return "Ano é obrigatório";
      if (Number(value) < 1000 || Number(value) > 2030)
        return "Ano deve ser entre 1000 e 2030";
      return "";
    default:
      return "";
  }
}

export default function LivroModal({
  livro,
  onSalvar,
  onFechar,
}: LivroModalProps) {
  const [form, setForm] = useState<LivroForm>(formInicial);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    setTouched({});
    setFieldErrors({});
  }, [livro]);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = modalRef.current;
    if (!node) return;
    const focusable = node.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
      if (e.key !== "Tab" || focusable.length === 0) return;
      const focusArray = Array.from(focusable);
      const idx = focusArray.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey) {
        if (idx === 0) {
          focusArray[focusArray.length - 1].focus();
          e.preventDefault();
        }
      } else {
        if (idx === focusArray.length - 1) {
          focusArray[0].focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onFechar]);

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, form[name as keyof LivroForm]);
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    },
    [form],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "ano") {
      const numValue = value === "" ? "" : Number(value);
      setForm((prev) => ({ ...prev, [name]: numValue }));
      if (touched[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: validateField(name, numValue),
        }));
      }
    } else if (name === "status") {
      setForm((prev) => ({
        ...prev,
        status: value as Status,
        avaliacao: value === "LIDO" ? prev.avaliacao : undefined,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value),
        }));
      }
    }
    setErro("");
  };

  const handleAvaliacao = (value: number) => {
    setForm((prev) => ({ ...prev, avaliacao: value }));
  };

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    const allTouched: Record<string, boolean> = {};
    for (const field of ["titulo", "autor", "genero", "ano"]) {
      allTouched[field] = true;
      errors[field] = validateField(field, form[field as keyof LivroForm]);
    }
    setTouched(allTouched);
    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    setErro("");
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

  const getInputClass = (name: string) => {
    const base =
      "w-full bg-surface-container-low border rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-30 focus:outline-none transition-colors font-sans";
    if (touched[name] && fieldErrors[name]) {
      return `${base} border-error focus:border-error`;
    }
    return `${base} border-outline-variant-15 focus:border-primary-30`;
  };

  return (
    <div
      className="fixed inset-0 bg-on-surface-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onFechar}
    >
      <div
        className="bg-surface border-none shadow-ambient rounded-2xl w-full max-w-lg p-8 flex flex-col gap-8 transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl text-primary">
              {livro ? "Editar Livro" : "Novo Livro"}
            </h2>
            <p className="text-xs font-sans uppercase tracking-widest text-on-surface-40 mt-1">
              Curadoria da sua Estante Digital
            </p>
          </div>
          <button
            onClick={onFechar}
            className="text-on-surface-40 hover:text-on-surface transition-colors p-2"
          >
            <span className="text-2xl leading-none">✕</span>
          </button>
        </div>

        {erro && (
          <p className="text-sm text-error bg-error-container border border-error-container px-4 py-3 rounded-lg">
            {erro}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-on-surface-40 uppercase tracking-widest ml-1">
              Título do Volume
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              onBlur={() => handleBlur("titulo")}
              placeholder="Ex: Dom Casmurro"
              className={getInputClass("titulo")}
            />
            {touched.titulo && fieldErrors.titulo && (
              <span className="text-xs text-error ml-1">
                {fieldErrors.titulo}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface-40 uppercase tracking-widest ml-1">
              Escrito por
            </label>
            <input
              name="autor"
              value={form.autor}
              onChange={handleChange}
              onBlur={() => handleBlur("autor")}
              placeholder="Ex: Machado de Assis"
              className={getInputClass("autor")}
            />
            {touched.autor && fieldErrors.autor && (
              <span className="text-xs text-error ml-1">
                {fieldErrors.autor}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="genero-select"
              className="text-[10px] font-bold text-on-surface-40 uppercase tracking-widest ml-1"
            >
              Gênero Literário
            </label>
            <select
              id="genero-select"
              name="genero"
              value={form.genero}
              onChange={handleChange}
              onBlur={() => handleBlur("genero")}
              className={`${getInputClass("genero")} appearance-none cursor-pointer`}
            >
              <option value="">Selecione um gênero</option>
              {GENEROS_LITERARIOS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {touched.genero && fieldErrors.genero && (
              <span className="text-xs text-error ml-1">
                {fieldErrors.genero}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface-40 uppercase tracking-widest ml-1">
              Ano de Lançamento
            </label>
            <input
              name="ano"
              type="number"
              value={form.ano}
              onChange={handleChange}
              onBlur={() => handleBlur("ano")}
              placeholder="Ex: 1899"
              className={getInputClass("ano")}
            />
            {touched.ano && fieldErrors.ano && (
              <span className="text-xs text-error ml-1">{fieldErrors.ano}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status-select"
              className="text-[10px] font-bold text-on-surface-40 uppercase tracking-widest ml-1"
            >
              Status de Leitura
            </label>
            <select
              id="status-select"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`${getInputClass("status")} appearance-none cursor-pointer`}
            >
              <option value="QUERO_LER">Quero Ler</option>
              <option value="LENDO">Lendo</option>
              <option value="LIDO">Lido</option>
            </select>
          </div>

          {form.status === "LIDO" && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-on-surface-40 uppercase tracking-widest ml-1">
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
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={
                        star <= (form.avaliacao || 0)
                          ? "text-yellow-500"
                          : "text-on-surface-30"
                      }
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
                {form.avaliacao !== undefined && (
                  <button
                    type="button"
                    onClick={() => handleAvaliacao(0)}
                    className="text-xs text-on-surface-50 hover:text-error ml-2"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-on-surface-40 uppercase tracking-widest ml-1">
              Breves Anotações
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Impressões sobre o livro..."
              rows={3}
              className={`${getInputClass("descricao")} resize-none`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            onClick={onFechar}
            variant="secondary"
            className="focus-ring"
          >
            Manter na estante
          </Button>
          <Button
            onClick={handleSubmit}
            loading={salvando}
            className="min-w-35 focus-ring"
            aria-live="polite"
          >
            {salvando
              ? "Curando..."
              : livro
                ? "Salvar Volume"
                : "Catalogar Livro"}
          </Button>
        </div>
      </div>
    </div>
  );
}
