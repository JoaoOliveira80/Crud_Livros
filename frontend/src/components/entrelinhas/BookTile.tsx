"use client";
import type { Livro } from "@/types/livros";
import { useLibrary } from "@/contexts/LibraryContext";
import { BookCover } from "./BookCover";
import { Icon } from "./Icons";
import { bookProgress, statusLabel } from "@/lib/stats";

export function BookTile({livro, compact = false}: {livro: Livro; compact?: boolean}) {
  const {openDetails, toggleFavorite, notify} = useLibrary();
  const progress = bookProgress(livro);
  return <article className={`book-tile ${compact ? "book-tile-compact" : ""}`}>
    <div className="tile-cover-wrap">
      <button type="button" className="cover-trigger" onClick={() => openDetails(livro)} aria-label={`Ver detalhes de ${livro.titulo}`}><BookCover livro={livro}/></button>
      <button type="button" className={`tile-heart ${livro.favorito ? "is-favorite" : ""}`} aria-label={livro.favorito ? `Desfavoritar ${livro.titulo}` : `Favoritar ${livro.titulo}`} title={livro.favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"} onClick={() => toggleFavorite(livro.id).catch(e => notify(e.message))}><Icon name="heart" size={18}/></button>
    </div>
    <button type="button" className="tile-title" onClick={() => openDetails(livro)}>{livro.titulo}</button>
    <p className="tile-author">{livro.autor}</p>
    <div className="tile-meta"><span className={`status-pill status-${livro.status.toLowerCase()}`}>{statusLabel[livro.status]}</span>{livro.avaliacao != null && <span className="tile-rating">★ {livro.avaliacao.toFixed(1)}</span>}</div>
    {livro.status === "LENDO" && !!livro.paginas && <div className="tile-progress"><div className="mini-progress"><span style={{width: `${progress}%`}}/></div><small>{progress}%</small></div>}
  </article>;
}
