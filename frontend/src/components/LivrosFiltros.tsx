interface LivrosFiltrosProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  generoFiltro: string;
  onGeneroChange: (valor: string) => void;
  generos: string[];
  statusFiltro?: string;
  onStatusChange?: (valor: string) => void;
  onLimpar: () => void;
  temFiltro: boolean;
  placeholder?: string;
}

export default function LivrosFiltros({
  busca,
  onBuscaChange,
  generoFiltro,
  onGeneroChange,
  generos,
  statusFiltro,
  onStatusChange,
  onLimpar,
  temFiltro,
  placeholder = "Buscar por título ou autor...",
}: LivrosFiltrosProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-70">
        <input
          type="search"
          placeholder={placeholder}
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant-15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-30 transition-colors"
        />
      </div>

      {onStatusChange && statusFiltro !== undefined && (
        <select
          value={statusFiltro}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filtrar por status"
          className="bg-surface-container-low border border-outline-variant-15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-30 transition-colors cursor-pointer"
        >
          <option value="">Todos os Status</option>
          <option value="QUERO_LER">Quero Ler</option>
          <option value="LENDO">Lendo</option>
          <option value="LIDO">Lido</option>
        </select>
      )}

      <select
        value={generoFiltro}
        onChange={(e) => onGeneroChange(e.target.value)}
        aria-label="Filtrar por gênero"
        className="bg-surface-container-low border border-outline-variant-15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-30 transition-colors cursor-pointer"
      >
        <option value="">Todos os Gêneros</option>
        {generos.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {temFiltro && (
        <button
          type="button"
          onClick={onLimpar}
          className="text-xs font-bold uppercase tracking-widest text-primary hover:underline px-2 self-center"
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
}
