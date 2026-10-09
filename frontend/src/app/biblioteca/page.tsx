"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { BookTile } from "@/components/entrelinhas/BookTile";
import { BookCover } from "@/components/entrelinhas/BookCover";
import { Icon } from "@/components/entrelinhas/Icons";
import { bookProgress, statusLabel } from "@/lib/stats";

const perPage = 12;
function LibraryContent() {
  const {livros, loading, openEditor, openDetails, toggleFavorite, notify} = useLibrary();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(() => params.get("favoritos") === "1" ? "FAVORITOS" : "TODOS");
  const [genre, setGenre] = useState("TODOS");
  const [sort, setSort] = useState("recentes");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const genres = useMemo(() => [...new Set(livros.map(l => l.genero))].sort((a,b)=>a.localeCompare(b,"pt-BR")),[livros]);
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    const result = livros.filter(l => (!query || `${l.titulo} ${l.autor} ${l.genero}`.toLocaleLowerCase("pt-BR").includes(query)) &&
      (filter === "TODOS" || (filter === "FAVORITOS" ? !!l.favorito : l.status === filter)) && (genre === "TODOS" || l.genero === genre));
    return result.sort((a,b) => sort === "titulo" ? a.titulo.localeCompare(b.titulo, "pt-BR") : sort === "autor" ? a.autor.localeCompare(b.autor, "pt-BR") : sort === "antigos" ? a.ano - b.ano : sort === "ano" ? b.ano - a.ano : (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt));
  }, [livros, search, filter, genre, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length/perPage));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current-1)*perPage, current*perPage);
  const setTab = (v: string) => {setFilter(v); setPage(1);};
  return <div className="library-page page-enter"><div className="page-intro library-intro"><div><span className="eyebrow"><span className="eyebrow-dot"/> SEU ACERVO PESSOAL</span><h1>Minha <em>biblioteca.</em></h1><p>Explore, organize e reencontre as histórias que fazem parte de você.</p></div><button type="button" className="btn btn-primary" onClick={() => openEditor()}><Icon name="plus" size={18}/> Adicionar livro</button></div>
    <div className="library-summary"><div><span className="summary-illustration"><Icon name="library" size={24}/></span><div><strong>{livros.length} livros</strong><span>coleção pessoal</span></div></div><p>“Os livros são uma forma de viajar sem sair do lugar.” <span>✳</span></p></div>
    <div className="library-tools"><div className="library-search"><Icon name="search" size={20}/><input value={search} onChange={e => {setSearch(e.target.value);setPage(1);}} placeholder="Buscar por título, autor ou gênero..." aria-label="Buscar livros"/>{search && <button type="button" onClick={() => setSearch("")} aria-label="Limpar busca"><Icon name="close" size={16}/></button>}</div><label className="filter-select"><Icon name="filter" size={18}/><select aria-label="Filtrar por gênero" value={genre} onChange={e => {setGenre(e.target.value);setPage(1);}}><option value="TODOS">Todos os gêneros</option>{genres.map(g => <option key={g} value={g}>{g}</option>)}</select></label><label className="filter-select"><select aria-label="Ordenar livros" value={sort} onChange={e => setSort(e.target.value)}><option value="recentes">Mais recentes</option><option value="antigos">Ano mais antigo</option><option value="ano">Ano mais novo</option><option value="titulo">Título (A–Z)</option><option value="autor">Autor (A–Z)</option></select></label></div>
    <div className="library-tabs-row"><div className="library-tabs" role="group" aria-label="Filtrar por status">{[["TODOS","Todos"],["LENDO","Lendo"],["QUERO_LER","Quero ler"],["LIDO","Concluídos"],["FAVORITOS","♡ Favoritos"]].map(([v,label]) => <button key={v} type="button" className={filter === v ? "tab-active" : ""} onClick={() => setTab(v)} aria-pressed={filter === v}>{label}</button>)}</div><div className="view-switch" role="group" aria-label="Exibição"><button className={layout === "grid" ? "selected" : ""} onClick={() => setLayout("grid")} aria-label="Exibição em grade" title="Grade"><Icon name="grid" size={17}/></button><button className={layout === "list" ? "selected" : ""} onClick={() => setLayout("list")} aria-label="Exibição em lista" title="Lista"><Icon name="list" size={18}/></button></div></div>
    <div className="library-count">{loading ? "Carregando livros..." : `${filtered.length} ${filtered.length === 1 ? "livro encontrado" : "livros encontrados"}`}</div>
    {loading ? <div className="loading-block"/> : shown.length ? (layout === "grid" ? <div className="library-grid">{shown.map(l => <BookTile key={l.id} livro={l}/>)}</div> : <div className="library-list">{shown.map(l => <article key={l.id} className="library-list-item"><button className="list-cover" onClick={() => openDetails(l)}><BookCover livro={l}/></button><div className="list-book-info"><span className="eyebrow">{l.genero} · {l.ano}</span><button onClick={() => openDetails(l)} className="list-title">{l.titulo}</button><p>{l.autor}</p></div><span className={`status-pill status-${l.status.toLowerCase()}`}>{statusLabel[l.status]}</span><span className="list-progress">{l.status === "LENDO" ? `${bookProgress(l)}% lido` : (l.paginas ? `${l.paginas} páginas` : "—")}</span><button aria-label={`Favoritar ${l.titulo}`} className={`icon-button ${l.favorito ? "is-favorite" : ""}`} onClick={() => toggleFavorite(l.id).catch(e => notify(e.message))}><Icon name="heart" size={20}/></button><button className="icon-button" aria-label={`Abrir ${l.titulo}`} onClick={() => openDetails(l)}><Icon name="chevron" size={19}/></button></article>)}</div>) : <div className="empty-panel library-empty"><Icon name="search" size={32}/><h2>Nenhum livro por aqui</h2><p>Experimente remover os filtros ou adicione uma nova história à estante.</p><button className="btn btn-secondary" onClick={() => {setSearch("");setGenre("TODOS");setTab("TODOS");}}>Limpar filtros</button></div>}
    {pages > 1 && <div className="pagination"><span>Página {current} de {pages}</span><div><button disabled={current === 1} onClick={() => setPage(p => Math.max(1,p-1))} aria-label="Página anterior">←</button>{Array.from({length: pages},(_,i) => <button key={i} className={i+1 === current ? "current" : ""} onClick={() => setPage(i+1)} aria-current={i+1===current ? "page" : undefined}>{i+1}</button>)}<button disabled={current===pages} onClick={() => setPage(p => Math.min(pages,p+1))} aria-label="Próxima página">→</button></div></div>}
  </div>;
}
export default function LibraryPage() {return <Suspense fallback={<div className="loading-block"/>}><LibraryContent/></Suspense>;}
