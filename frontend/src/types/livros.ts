export type Status = "QUERO_LER" | "LENDO" | "LIDO";

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano: number;
  descricao?: string;
  status: Status;
  avaliacao?: number;
  createdAt: string;
}

export interface LivroForm {
  titulo: string;
  autor: string;
  genero: string;
  ano: number | "";
  descricao: string;
  status: Status;
  avaliacao?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
