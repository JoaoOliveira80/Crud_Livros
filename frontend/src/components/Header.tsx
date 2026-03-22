import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onNovo: () => void;
  onAviso: (msg: string) => void;
}

export default function Header({ onNovo, onAviso }: HeaderProps) {
  const pathname = usePathname();

  const linkClass = (path: string) => 
    `text-sm font-medium transition-colors ${
      pathname === path 
        ? "text-primary border-b-2 border-primary pb-1" 
        : "text-on-surface/60 hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-40 glass border-b border-outline-variant/10">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <h1 className="text-2xl font-serif italic text-primary tracking-tight">
          Minha Estante
        </h1>
        
        <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
          <Link href="/" className={linkClass("/")}>Painel</Link>
          <Link href="/biblioteca" className={linkClass("/biblioteca")}>Biblioteca</Link>
          <Link href="/configuracoes" className={linkClass("/configuracoes")}>Configurações</Link>
        </nav>

        <button onClick={onNovo} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span>
          Adicionar Livro
        </button>
      </div>
    </header>
  );
}
