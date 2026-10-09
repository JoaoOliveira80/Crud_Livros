"use client";
import { useEffect, useRef, useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { bookProgress, statusLabel } from "@/lib/stats";
import { BookCover } from "./BookCover";
import { Icon } from "./Icons";

export function BookDetails() {
  const {viewing, closeDetails, openEditor, deleteBook, toggleFavorite, setProgress, livros, notify} = useLibrary();
  const live = viewing && (livros.find(l => l.id === viewing.id) ?? viewing);
  const isOpen = !!live;
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {setPage(live?.paginaAtual ?? 0); setConfirm(false);}, [live?.id, live?.paginaAtual]);
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) closeDetails();
      if (e.key === "Tab" && ref.current) {
        const focus = Array.from(ref.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])'));
        if (focus.length && e.shiftKey && document.activeElement === focus[0]) {e.preventDefault(); focus[focus.length-1].focus();}
        else if (focus.length && !e.shiftKey && document.activeElement === focus[focus.length-1]) {e.preventDefault(); focus[0].focus();}
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {document.body.style.overflow = before; document.removeEventListener("keydown", keydown); previouslyFocused?.focus?.();};
  }, [isOpen, busy, closeDetails]);
  if (!live) return null;
  const livro = live;
  async function updateProgress() {setBusy(true); try {await setProgress(livro.id, page);} catch (e) {notify(e instanceof Error ? e.message : "Erro ao salvar progresso");} finally {setBusy(false);}}
  async function remove() {setBusy(true); try {await deleteBook(livro.id);} catch (e) {notify(e instanceof Error ? e.message : "Erro ao excluir livro");} finally {setBusy(false);}}
  return <div className="modal-overlay" onMouseDown={e => {if (e.target === e.currentTarget && !busy) closeDetails();}}>
    <div className="modal-panel detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title" ref={ref}>
      <button className="icon-button detail-close" type="button" aria-label="Fechar detalhes" onClick={closeDetails}><Icon name="close"/></button>
      <div className="detail-cover-box"><BookCover livro={livro}/></div>
      <div className="detail-main"><span className="eyebrow">{livro.genero} · {livro.ano}</span><h2 id="detail-title">{livro.titulo}</h2><p className="detail-author">por {livro.autor}</p>
        <div className="detail-badges"><span className={`status-pill status-${livro.status.toLowerCase()}`}>{statusLabel[livro.status]}</span>{livro.avaliacao != null && <span>★ {livro.avaliacao}/5</span>}{livro.paginas && <span>{livro.paginas} páginas</span>}</div>
        {livro.descricao && <p className="detail-description">{livro.descricao}</p>}
        {livro.notas && <div className="detail-notes"><strong>Suas anotações</strong><p>{livro.notas}</p></div>}
        {livro.paginas && <div className="detail-reading"><div className="space-between"><strong>Progresso de leitura</strong><span>{bookProgress(livro)}%</span></div><div className="progress-track"><span style={{width: `${bookProgress(livro)}%`}}/></div><div className="progress-form"><label htmlFor="detail-page">Página atual</label><input id="detail-page" type="number" value={page} min={0} max={livro.paginas} onChange={e => setPage(Number(e.target.value))}/><button type="button" className="btn btn-primary btn-small" onClick={updateProgress} disabled={busy || page === (livro.paginaAtual ?? 0)}>Atualizar</button></div></div>}
        <div className="detail-actions"><button className="btn btn-secondary" type="button" onClick={() => openEditor(livro)}><Icon name="edit" size={16}/> Editar livro</button><button type="button" className="btn btn-outline" onClick={() => toggleFavorite(livro.id).catch(e => notify(e.message))}><Icon name="heart" size={16}/> {livro.favorito ? "Favoritado" : "Favoritar"}</button></div>
        <div className="detail-footer">{confirm ? <div className="confirm-row" role="alert"><span>Excluir definitivamente?</span><button type="button" className="text-danger" onClick={remove} disabled={busy}>Sim, excluir</button><button type="button" onClick={() => setConfirm(false)}>Cancelar</button></div> : <button type="button" className="subtle-link text-danger" onClick={() => setConfirm(true)}><Icon name="trash" size={15}/> Remover da biblioteca</button>}</div>
      </div>
    </div>
  </div>;
}
