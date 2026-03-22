import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  onNovo: () => void;
  onAviso: (msg: string) => void;
}

export default function Header({ onNovo, onAviso }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const linkClass = (path: string) => 
    `text-sm font-medium transition-colors ${
      pathname === path 
        ? "text-primary border-b-2 border-primary pb-1" 
        : "text-on-surface-60 hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-40 glass border-b border-outline-variant-10">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <h1 className="text-2xl font-serif italic text-primary tracking-tight">
          Minha Estante
        </h1>
        
        <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
          <Link href="/" className={linkClass("/")}>Painel</Link>
          <Link href="/biblioteca" className={linkClass("/biblioteca")}>Biblioteca</Link>
          <Link href="/configuracoes" className={linkClass("/configuracoes")}>Configurações</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-surface-container-low text-on-surface-60 hover:text-primary"
            aria-label={theme === "light" ? "Alternar para modo escuro" : "Alternar para modo claro"}
          >
            {theme === "light" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
          <button onClick={onNovo} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            Adicionar Livro
          </button>
        </div>
      </div>
    </header>
  );
}
