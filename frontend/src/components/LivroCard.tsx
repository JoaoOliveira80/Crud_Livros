import { Livro } from "../types/livros";

interface LivroCardProps {
  livro: Livro;
  onEditar: (livro: Livro) => void;
  onDeletar: (id: number) => void;
}

const statusConfig = {
  QUERO_LER: { label: "Quero Ler", className: "status-quero-ler" },
  LENDO: { label: "Lendo", className: "status-lendo" },
  LIDO: { label: "Lido", className: "status-lido" },
};

const generoGradients: Record<string, string> = {
  "Ficção": "from-sky-200 to-indigo-200 dark:from-sky-900 dark:to-indigo-900",
  "Não-ficção": "from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900",
  "Fantasia": "from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900",
  "Romance": "from-rose-200 to-red-200 dark:from-rose-900 dark:to-red-900",
  "Terror": "from-slate-300 to-zinc-400 dark:from-slate-800 dark:to-zinc-800",
  "Ficção Científica": "from-cyan-200 to-teal-200 dark:from-cyan-900 dark:to-teal-900",
  "Biografia": "from-emerald-200 to-green-200 dark:from-emerald-900 dark:to-green-900",
  "História": "from-yellow-200 to-amber-200 dark:from-yellow-900 dark:to-amber-900",
  "Poesia": "from-violet-200 to-fuchsia-200 dark:from-violet-900 dark:to-fuchsia-900",
};

function getCoverGradient(genero: string): string {
  return generoGradients[genero] || "from-surface-container-low to-surface-container-lowest";
}

function Estrelas({ avaliacao }: { avaliacao?: number }) {
  if (avaliacao === undefined || avaliacao === null) return null;
  return (
    <div className="flex gap-0.5" aria-label={`${avaliacao} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= avaliacao ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={star <= avaliacao ? "text-yellow-500" : "text-on-surface-20"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function LivroCard({
  livro,
  onEditar,
  onDeletar,
}: LivroCardProps) {
  const status = statusConfig[livro.status];

  return (
    <div className="card-ambient flex flex-col hover:translate-y-[-4px] transition-all duration-300 group overflow-hidden">
      <div className={`h-36 bg-gradient-to-br ${getCoverGradient(livro.genero)} flex items-center justify-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-20">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
          <div className="flex items-center gap-2">
            {livro.status === "LIDO" && <Estrelas avaliacao={livro.avaliacao} />}
            <span className="text-xs font-medium text-on-surface-40">{livro.ano}</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-serif text-primary leading-tight group-hover:text-primary transition-colors">
            {livro.titulo}
          </h3>
          <p className="text-sm font-medium text-on-surface-60 mt-1">{livro.autor}</p>
        </div>

        {livro.descricao && (
          <p className="text-xs text-on-surface-50 leading-relaxed line-clamp-3 italic">
            &ldquo;{livro.descricao}&rdquo;
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-30">
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
              className="text-xs font-bold text-on-surface-60 hover:text-error transition-colors px-2 py-1"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
