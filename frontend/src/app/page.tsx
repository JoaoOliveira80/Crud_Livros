"use client";
import Link from "next/link";
import { useLibrary } from "@/contexts/LibraryContext";
import { Icon } from "@/components/entrelinhas/Icons";
import { BookCover } from "@/components/entrelinhas/BookCover";
import { BookTile } from "@/components/entrelinhas/BookTile";
import { bookProgress } from "@/lib/stats";

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
};

export default function Dashboard() {
  const {livros, stats, goal, loading, openEditor, openDetails, notify, setProgress} = useLibrary();
  const reading = livros.filter(l => l.status === "LENDO");
  const recent = [...livros].sort((a,b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt)).slice(0, 5);
  const favorites = livros.filter(l => l.favorito).slice(0, 4);
  const genres = Object.entries(stats.porGenero).sort((a,b) => b[1]-a[1]);
  const goalPercentage = Math.min(100, Math.round(stats.lidos / goal * 100));
  return <div className="dashboard page-enter">
    <div className="page-intro"><div><span className="eyebrow"><span className="eyebrow-dot"/> SUA JORNADA DE LEITURA</span><h1>{greeting()}, <em>leitor.</em></h1><p>Cada livro é um novo começo. Que história vamos descobrir hoje?</p></div><span className="intro-date">{new Intl.DateTimeFormat("pt-BR", {day: "numeric", month: "long", year: "numeric"}).format(new Date())}</span></div>

    <section className="hero-banner" aria-label="Descubra seu próximo capítulo">
      <div className="hero-copy"><span className="hero-label"><Icon name="sparkles" size={14}/> BEM-VINDO AO SEU UNIVERSO</span><h2>Mil histórias.<br/><em>Uma só estante.</em></h2><p>Organize suas leituras, registre suas descobertas e dê vida à sua coleção pessoal.</p><button className="btn btn-hero" onClick={() => openEditor()}><Icon name="plus" size={18}/> Adicionar leitura <Icon name="arrow" size={17}/></button></div>
      <div className="hero-art" aria-hidden="true"><span className="hero-star hero-star-one">✳</span><span className="hero-star hero-star-two">✦</span><div className="hero-circle"/><div className="hero-book hero-book-back"><div>THE<br/>ART OF<br/>STORIES</div><small>ENTRELINHAS ORIGINALS</small></div><div className="hero-book hero-book-front"><span className="hero-book-mini">CHAPTER NO. 01</span><strong>Between<br/><i>the lines</i></strong><span className="hero-illustration">✳</span><small>COLLECTION • 2026</small></div><div className="hero-floating"><span>✦</span><strong>read more.</strong><small>feel more.</small></div></div>
    </section>

    <section className="stats-grid" aria-label="Resumo da biblioteca">
      <div className="stat-card"><div className="stat-icon amber"><Icon name="library"/></div><span>Total na estante</span><strong>{loading ? "—" : stats.total.toString().padStart(2, "0")}</strong><small>Histórias catalogadas <Icon name="arrowUp" size={13}/></small></div>
      <div className="stat-card"><div className="stat-icon mint"><Icon name="book"/></div><span>Livros concluídos</span><strong>{loading ? "—" : stats.lidos.toString().padStart(2, "0")}</strong><small>Sua jornada até aqui</small></div>
      <div className="stat-card"><div className="stat-icon lilac"><Icon name="clock"/></div><span>Em andamento</span><strong>{loading ? "—" : stats.lendo.toString().padStart(2, "0")}</strong><small>Novos mundos abertos</small></div>
      <div className="stat-card"><div className="stat-icon coral"><Icon name="heart"/></div><span>Seus favoritos</span><strong>{loading ? "—" : stats.favoritos.toString().padStart(2, "0")}</strong><small>Histórias para guardar</small></div>
    </section>

    <div className="dashboard-columns"><div className="dashboard-primary">
      <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">CONTINUE DE ONDE PAROU</span><h2>Na sua cabeceira <span className="heading-sparkle">✳</span></h2></div><Link href="/biblioteca" className="text-link">Ver biblioteca <Icon name="arrow" size={16}/></Link></div>
      {loading ? <div className="loading-block"/> : reading.length ? <div className="reading-list">{reading.slice(0,2).map(l => <article className="reading-card" key={l.id}><button type="button" className="reading-cover" aria-label={`Abrir ${l.titulo}`} onClick={() => openDetails(l)}><BookCover livro={l}/></button><div className="reading-info"><span className="reading-genre">{l.genero}</span><button type="button" className="reading-title" onClick={() => openDetails(l)}>{l.titulo}</button><p>por {l.autor}</p><div className="reading-progress-text"><span>Seu progresso</span><strong>{bookProgress(l)}%</strong></div><div className="progress-track"><span style={{width: `${bookProgress(l)}%`}}/></div><div className="reading-bottom"><small>{l.paginaAtual ?? 0} de {l.paginas ?? "?"} páginas</small><button type="button" onClick={() => {if (!l.paginas) {openDetails(l); return;} const next = Math.min(l.paginas, (l.paginaAtual ?? 0) + 10); setProgress(l.id,next).catch(e => notify(e.message));}} aria-label={`Avançar 10 páginas em ${l.titulo}`}>+10 págs <Icon name="arrow" size={14}/></button></div></div></article>)}</div> : <div className="empty-panel"><Icon name="book" size={29}/><h3>Seu próximo capítulo começa aqui</h3><p>Marque um livro como “Lendo agora” e acompanhe o progresso.</p><button className="btn btn-secondary" onClick={() => openEditor()}>Adicionar livro</button></div>}</section>
      <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">CURADORIA PESSOAL</span><h2>Recentes na estante</h2></div><Link href="/biblioteca" className="text-link">Explorar todos <Icon name="arrow" size={16}/></Link></div><div className="recent-grid">{recent.map(l => <BookTile key={l.id} livro={l} compact/>)}</div>{!loading && recent.length === 0 && <div className="empty-panel">Sua estante ainda está vazia.</div>}</section>
    </div><div className="dashboard-aside">
      <section className="goal-card"><div className="goal-header"><span className="eyebrow">META DE LEITURA</span><span className="goal-year">{new Date().getFullYear()}</span></div><h3>Um livro de<br/><em>cada vez.</em></h3><div className="goal-ring" style={{"--goal-pct": `${goalPercentage}%`} as React.CSSProperties}><div><strong>{goalPercentage}%</strong><small>da meta</small></div></div><p><strong>{stats.lidos} livros</strong> de {goal} planejados</p><Link href="/estatisticas" className="goal-link">Acompanhar minha meta <Icon name="arrow" size={16}/></Link><span className="goal-decor" aria-hidden="true">✳</span></section>
      <section className="aside-panel"><div className="aside-title"><div><span className="eyebrow">UM POUCO DE VOCÊ</span><h3>Seus gêneros</h3></div><Icon name="layers" size={21}/></div>{genres.slice(0,4).map(([genre,count], i) => <div className="genre-line" key={genre}><div className="genre-label"><span className={`genre-dot genre-dot-${i}`}/><span>{genre}</span><strong>{count}</strong></div><div className="genre-track"><span className={`genre-fill genre-fill-${i}`} style={{width: `${stats.total ? (count/stats.total)*100 : 0}%`}}/></div></div>)}<Link className="aside-link" href="/estatisticas">Ver estatísticas completas <Icon name="chevron" size={15}/></Link></section>
      <section className="quote-card"><span>“</span><blockquote>Uma história pode mudar a maneira como enxergamos o mundo.</blockquote><small>— Um lembrete para continuar lendo</small></section>
    </div></div>
    {favorites.length > 0 && <section className="dashboard-section favorites-section"><div className="section-heading"><div><span className="eyebrow">PERTO DO CORAÇÃO</span><h2>Para guardar com carinho</h2></div><Link href="/biblioteca?favoritos=1" className="text-link">Ver favoritos <Icon name="arrow" size={16}/></Link></div><div className="favorite-row">{favorites.map(l => <button className="favorite-mini" key={l.id} type="button" onClick={() => openDetails(l)}><BookCover livro={l}/><div><strong>{l.titulo}</strong><span>{l.autor}</span></div><Icon name="chevron" size={18}/></button>)}</div></section>}
  </div>;
}
