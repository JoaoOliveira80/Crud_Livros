interface HeaderProps {
  onNovo: () => void;
}

export default function Header({ onNovo }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-xl">◈</span>
          <span className="font-semibold text-lg tracking-tight">
            Minha Estante
          </span>
        </div>
        <button
          onClick={onNovo}
          className="bg-emerald-400 text-zinc-950 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-emerald-300 transition-colors"
        >
          + Novo Livro
        </button>
      </div>
    </header>
  );
}
