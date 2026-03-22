import { Livro } from "../types/livros";

interface LivroCardProps {
  livro: Livro;
  onEditar: (livro: Livro) => void;
  onDeletar: (id: number) => void;
}

const statusConfig = {
  QUERO_LER: { label: "Quero Ler", className: "bg-primary/10 text-primary" },
  LENDO: { label: "Lendo", className: "bg-secondary text-white" },
  LIDO: { label: "Lido", className: "bg-surface-container-low text-on-surface/70" },
};

export default function LivroCard({
  livro,
  onEditar,
  onDeletar,
}: LivroCardProps) {
  const status = statusConfig[livro.status];

  return (
    <div className="card-ambient p-6 flex flex-col gap-4 hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
        <span className="text-xs font-medium text-on-surface/40">{livro.ano}</span>
      </div>

      <div>
        <h3 className="text-xl font-serif text-primary leading-tight group-hover:text-primary-container transition-colors">
          {livro.titulo}
        </h3>
        <p className="text-sm font-medium text-on-surface/60 mt-1">{livro.autor}</p>
      </div>

      {livro.descricao && (
        <p className="text-xs text-on-surface/50 leading-relaxed line-clamp-3 italic">
          &ldquo;{livro.descricao}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface/30">
          {livro.genero}
        </span>
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditar(livro)}
            className="text-xs font-bold text-primary hover:underline"
          >
            Editar
          </button>
          <button
            onClick={() => onDeletar(livro.id)}
            className="text-xs font-bold text-on-surface/60 hover:text-red-500 transition-colors px-2 py-1"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
