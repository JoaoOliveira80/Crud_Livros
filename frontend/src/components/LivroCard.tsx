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

const generoCoverClass: Record<string, string> = {
  Ficção: "book-cover--ficcao",
  "Não-ficção": "book-cover--nao-ficcao",
  Fantasia: "book-cover--fantasia",
  Romance: "book-cover--romance",
  Terror: "book-cover--terror",
  "Ficção Científica": "book-cover--ficcao-cientifica",
  Biografia: "book-cover--biografia",
  História: "book-cover--historia",
  Poesia: "book-cover--poesia",
};

function getCoverClass(genero: string): string {
  return generoCoverClass[genero] ?? "book-cover--default";
}

function Estrelas({ avaliacao }: { avaliacao?: number }) {
  if (avaliacao === undefined || avaliacao === null) return null;
  return (
    <div
      className="flex gap-0.5"
      aria-label={`${avaliacao} de 5 estrelas`}
    >
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
          className={
            star <= avaliacao ? "text-yellow-500" : "text-on-surface-20"
          }
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
    <div className="card-ambient flex flex-col hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      <div
        className={`book-cover w-full h-44 ${getCoverClass(livro.genero)} flex items-center justify-center`}
        role="img"
        aria-label={`Capa estilizada - gênero ${livro.genero}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-on-surface-20"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
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
            {livro.status === "LIDO" && (
              <Estrelas avaliacao={livro.avaliacao} />
            )}
            <span className="text-xs font-medium text-on-surface-40">
              {livro.ano}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-serif text-on-surface leading-tight group-hover:text-primary transition-colors font-semibold">
            {livro.titulo}
          </h3>
          <p className="text-sm font-medium text-on-surface-60 mt-1">
            {livro.autor}
          </p>
        </div>

        {livro.descricao && (
          <p className="text-xs text-on-surface-50 leading-relaxed line-clamp-3 italic">
            &ldquo;{livro.descricao}&rdquo;
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-30 truncate">
            {livro.genero}
          </span>
          <div className="flex gap-3 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEditar(livro)}
              className="text-xs font-bold text-primary hover:underline focus-ring rounded"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDeletar(livro.id)}
              className="text-xs font-bold text-on-surface-60 hover:text-error transition-colors px-2 py-1 focus-ring rounded"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
