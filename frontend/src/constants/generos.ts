export const GENEROS_LITERARIOS = [
  "Ficção",
  "Não-ficção",
  "Fantasia",
  "Romance",
  "Terror",
  "Ficção Científica",
  "Biografia",
  "História",
  "Poesia",
  "Outro",
] as const;

export type GeneroLiterario = (typeof GENEROS_LITERARIOS)[number];

/** Mescla gêneros canônicos com valores já usados na coleção. */
export function generosParaSelect(existentes: string[] = []): string[] {
  const set = new Set<string>([...GENEROS_LITERARIOS, ...existentes.filter(Boolean)]);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
