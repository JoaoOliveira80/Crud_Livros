interface PaginationProps {
  pagina: number;
  totalPages: number;
  onPaginaChange: (pagina: number) => void;
  className?: string;
}

export default function Pagination({
  pagina,
  totalPages,
  onPaginaChange,
  className = "mt-16",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="navigation"
      aria-label="Paginação"
    >
      <button
        type="button"
        onClick={() => onPaginaChange(Math.max(0, pagina - 1))}
        disabled={pagina === 0}
        className="px-4 py-2 rounded-lg border border-outline-variant-15 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
      >
        Anterior
      </button>
      <span className="text-sm text-on-surface-60 px-4">
        {pagina + 1} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPaginaChange(Math.min(totalPages - 1, pagina + 1))}
        disabled={pagina >= totalPages - 1}
        className="px-4 py-2 rounded-lg border border-outline-variant-15 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
      >
        Próxima
      </button>
    </div>
  );
}
