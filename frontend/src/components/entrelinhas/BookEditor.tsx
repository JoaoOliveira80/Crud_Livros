"use client";

import { useEffect, useRef, useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import type { LivroForm, Status } from "@/types/livros";
import { Icon } from "./Icons";

const empty: LivroForm = {titulo: "", autor: "", genero: "", ano: new Date().getFullYear(), descricao: "", status: "QUERO_LER", avaliacao: null, paginas: null, paginaAtual: 0, favorito: false, notas: "", isbn: ""};
const genres = ["Ficção", "Ficção científica", "Fantasia", "Romance", "Literatura brasileira", "Clássicos", "Não ficção", "Desenvolvimento", "Suspense", "Biografia", "Poesia", "Outro"];

export function BookEditor() {
  const {editing, closeEditor, saveBook} = useLibrary();
  const [form, setForm] = useState<LivroForm>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = editing !== null;
  useEffect(() => {
    if (editing === "new") setForm({...empty});
    else if (editing) setForm({titulo: editing.titulo, autor: editing.autor, genero: editing.genero, ano: editing.ano, descricao: editing.descricao ?? "", status: editing.status, avaliacao: editing.avaliacao, paginas: editing.paginas, paginaAtual: editing.paginaAtual ?? 0, favorito: !!editing.favorito, notas: editing.notas ?? "", isbn: editing.isbn ?? ""});
    setError("");
  }, [editing]);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLInputElement>("input")?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) closeEditor();
      if (event.key !== "Tab" || !ref.current) return;
      const elems = [...ref.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
      if (!elems.length) return;
      const first = elems[0], last = elems[elems.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
      if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
    }
    document.addEventListener("keydown", keydown);
    return () => {document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", keydown); previous?.focus?.();};
  }, [isOpen, saving, closeEditor]);
  if (!isOpen) return null;
  const change = (key: keyof LivroForm, value: unknown) => setForm((prev) => ({...prev, [key]: value}));
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true); setError("");
    try {await saveBook(form);} catch (err) {setError(err instanceof Error ? err.message : "Não foi possível salvar o livro.");} finally {setSaving(false);}
  }
  return <div className="modal-overlay" onMouseDown={(e) => {if (e.target === e.currentTarget && !saving) closeEditor();}}>
    <div className="modal-panel editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title" ref={ref}>
      <div className="modal-heading"><div><span className="eyebrow">SUA BIBLIOTECA</span><h2 id="editor-title">{editing === "new" ? "Adicionar novo livro" : "Editar livro"}</h2><p>As boas histórias merecem um lugar especial.</p></div><button type="button" className="icon-button" onClick={closeEditor} aria-label="Fechar"><Icon name="close"/></button></div>
      <form onSubmit={submit} className="editor-form">
        <div className="form-grid"><label className="field field-wide">Título do livro <input required maxLength={180} placeholder="Ex: A biblioteca da meia-noite" value={form.titulo} onChange={e => change("titulo", e.target.value)}/></label>
          <label className="field">Autor(a) <input required maxLength={120} placeholder="Nome do autor" value={form.autor} onChange={e => change("autor", e.target.value)}/></label>
          <label className="field">Gênero <input required list="entrelinhas-genres" maxLength={80} placeholder="Selecione ou escreva" value={form.genero} onChange={e => change("genero", e.target.value)}/><datalist id="entrelinhas-genres">{genres.map(g => <option key={g} value={g}/>)}</datalist></label>
          <label className="field">Ano <input type="number" required min={1000} max={2100} value={form.ano} onChange={e => change("ano", e.target.value === "" ? "" : Number(e.target.value))}/></label>
          <label className="field">Total de páginas <input type="number" min={1} placeholder="Ex: 320" value={form.paginas ?? ""} onChange={e => change("paginas", e.target.value ? Number(e.target.value) : null)}/></label>
          <label className="field">Status de leitura <select value={form.status} onChange={e => change("status", e.target.value as Status)}><option value="QUERO_LER">Quero ler</option><option value="LENDO">Lendo agora</option><option value="LIDO">Concluído</option></select></label>
          <label className="field">Página atual <input type="number" min={0} max={form.paginas ?? undefined} value={form.paginaAtual ?? 0} onChange={e => change("paginaAtual", Number(e.target.value))}/></label>
          <label className="field">Sua avaliação <select value={form.avaliacao ?? ""} onChange={e => change("avaliacao", e.target.value ? Number(e.target.value) : null)}><option value="">Sem avaliação</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}</select></label>
          <label className="field">ISBN (opcional) <input maxLength={20} placeholder="978..." value={form.isbn ?? ""} onChange={e => change("isbn", e.target.value)}/></label>
          <label className="field field-wide">Sinopse / descrição <textarea rows={2} maxLength={2000} placeholder="Sobre o que é essa história?" value={form.descricao ?? ""} onChange={e => change("descricao", e.target.value)}/></label>
          <label className="field field-wide">Suas anotações <textarea rows={2} maxLength={3000} placeholder="Uma frase, um insight, um sentimento..." value={form.notas ?? ""} onChange={e => change("notas", e.target.value)}/></label>
          <label className="check-field field-wide"><input type="checkbox" checked={!!form.favorito} onChange={e => change("favorito", e.target.checked)}/> Marcar como favorito</label>
        </div>
        {error && <div role="alert" className="form-error">{error}</div>}
        <div className="modal-actions"><button type="button" className="btn btn-ghost" disabled={saving} onClick={closeEditor}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Salvando…" : editing === "new" ? "Adicionar à estante" : "Salvar alterações"} <Icon name="arrow" size={16}/></button></div>
      </form>
    </div>
  </div>;
}
