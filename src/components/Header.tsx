interface HeaderProps {
  onNovo: () => void;
}

export default function Header({ onNovo }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-outline-variant/10">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <h1 className="text-2xl font-serif italic text-primary tracking-tight">
          Minha Estante
        </h1>
        
        <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
          <a href="#" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">Dashboard</a>
          <a href="#" className="text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">Minha Biblioteca</a>
          <a href="#" className="text-sm font-medium text-on-surface/60 hover:text-primary transition-colors">Configurações</a>
        </nav>

        <button onClick={onNovo} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span>
          Adicionar Livro
        </button>
      </div>
    </header>
  );
}
