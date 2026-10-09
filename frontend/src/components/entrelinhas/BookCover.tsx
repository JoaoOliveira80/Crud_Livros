import type { Livro } from "@/types/livros";

const palettes = [
  ["#173c43", "#79a49d", "#e1e9d3"], ["#b24d38", "#e3a06e", "#ffdf9f"],
  ["#323853", "#7986a5", "#f3d5a7"], ["#786a49", "#c4b592", "#fbede0"],
  ["#6f2940", "#b4758a", "#eebcbb"], ["#526b56", "#99b396", "#e9e7d0"],
  ["#233c68", "#8199c2", "#d7dae6"], ["#8a522e", "#d0a467", "#ffe3ae"],
];

export function BookCover({livro, className = ""}: {livro: Livro; className?: string}) {
  const hash = [...livro.titulo].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const [dark, light, accent] = palettes[hash % palettes.length];
  return <div className={`book-cover ${className}`} style={{"--cover-dark": dark, "--cover-light": light, "--cover-accent": accent} as React.CSSProperties} aria-label={`Capa ilustrativa de ${livro.titulo}`}>
    <div className="cover-decor cover-decor-one"/><div className="cover-decor cover-decor-two"/>
    <span className="cover-top">ENTRELINHAS • COLLECTION</span>
    <span className="cover-title">{livro.titulo}</span>
    <span className="cover-line"/>
    <span className="cover-author">{livro.autor}</span>
    <span className="cover-bottom">✦</span>
  </div>;
}
