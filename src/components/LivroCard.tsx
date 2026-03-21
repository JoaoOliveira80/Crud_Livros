import { Livro } from "../types/livros";

interface LivroCardProps {
  livro: Livro;
  onEditar: (livro: Livro) => void;
  onDeletar: (id: number) => void;
}

const statusConfig = {
  QUERO_LER: { label: "Quero Ler", className: "bg-blue-500/10 text-blue-400" },
  LENDO: { label: "Lendo", className: "bg-amber-500/10 text-amber-400" },
  LIDO: { label: "Lido", className: "bg-emerald-500/10 text-emerald-400" },
};

export default function LivroCard({
  livro,
  onEditar,
  onDeletar,
}: LivroCardProps) {
  const status = statusConfig[livro.status];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-md ${status.className}`}
        >
          {status.label}
        </span>
        <span className="text-xs text-zinc-500">{livro.ano}</span>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-100 leading-snug">
          {livro.titulo}
        </h3>
        <p className="text-sm text-zinc-400 mt-0.5">{livro.autor}</p>
      </div>

      {livro.descricao && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
          {livro.descricao}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800">
        <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">
          {livro.genero}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEditar(livro)}
            className="text-xs text-zinc-400 border border-zinc-700 px-3 py-1 rounded-md hover:text-emerald-400 hover:border-emerald-400 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDeletar(livro.id)}
            className="text-xs text-zinc-500 border border-zinc-800 px-3 py-1 rounded-md hover:text-red-400 hover:border-red-400 transition-colors"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
