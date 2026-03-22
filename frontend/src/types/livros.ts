export type Status = "QUERO_LER" | "LENDO" | "LIDO";

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano: number;
  descricao?: string;
  status: Status;
  createdAt: string;
}

export interface LivroForm {
  titulo: string;
  autor: string;
  genero: string;
  ano: number | "";
  descricao: string;
  status: Status;
}
