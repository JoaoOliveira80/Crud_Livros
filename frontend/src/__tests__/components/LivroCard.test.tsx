import { render, screen, fireEvent } from "@testing-library/react";
import LivroCard from "@/components/LivroCard";
import { Livro } from "@/types/livros";

const livroBase: Livro = {
  id: 1,
  titulo: "Dom Casmurro",
  autor: "Machado de Assis",
  genero: "Romance",
  ano: 1899,
  descricao: "Clássico da literatura brasileira",
  status: "QUERO_LER",
  createdAt: "2026-01-01T00:00:00",
};

describe("LivroCard", () => {
  const onEditar = jest.fn();
  const onDeletar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar título e autor", () => {
    render(<LivroCard livro={livroBase} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.getByText("Dom Casmurro")).toBeInTheDocument();
    expect(screen.getByText("Machado de Assis")).toBeInTheDocument();
  });

  it("deve renderizar o status 'Quero Ler'", () => {
    render(<LivroCard livro={livroBase} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.getByText("Quero Ler")).toBeInTheDocument();
  });

  it("deve renderizar o status 'Lendo'", () => {
    const livro = { ...livroBase, status: "LENDO" as const };
    render(<LivroCard livro={livro} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.getByText("Lendo")).toBeInTheDocument();
  });

  it("deve renderizar o status 'Lido'", () => {
    const livro = { ...livroBase, status: "LIDO" as const };
    render(<LivroCard livro={livro} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.getByText("Lido")).toBeInTheDocument();
  });

  it("deve exibir estrelas quando status é LIDO com avaliação", () => {
    const livro = { ...livroBase, status: "LIDO" as const, avaliacao: 4 };
    render(<LivroCard livro={livro} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.getByLabelText("4 de 5 estrelas")).toBeInTheDocument();
  });

  it("não deve exibir estrelas quando status não é LIDO", () => {
    const livro = { ...livroBase, avaliacao: 3 };
    render(<LivroCard livro={livro} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.queryByLabelText(/de 5 estrelas/)).not.toBeInTheDocument();
  });

  it("deve exibir descrição quando existe", () => {
    render(<LivroCard livro={livroBase} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.getByText(/Clássico da literatura brasileira/)).toBeInTheDocument();
  });

  it("não deve exibir descrição quando não existe", () => {
    const livro = { ...livroBase, descricao: undefined };
    render(<LivroCard livro={livro} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.queryByText(/Clássico/)).not.toBeInTheDocument();
  });

  it("deve exibir gênero e ano", () => {
    render(<LivroCard livro={livroBase} onEditar={onEditar} onDeletar={onDeletar} />);

    expect(screen.getByText("Romance")).toBeInTheDocument();
    expect(screen.getByText("1899")).toBeInTheDocument();
  });

  it("deve chamar onEditar ao clicar no botão Editar", () => {
    render(<LivroCard livro={livroBase} onEditar={onEditar} onDeletar={onDeletar} />);

    fireEvent.click(screen.getByText("Editar"));

    expect(onEditar).toHaveBeenCalledWith(livroBase);
  });

  it("deve chamar onDeletar ao clicar no botão Deletar", () => {
    render(<LivroCard livro={livroBase} onEditar={onEditar} onDeletar={onDeletar} />);

    fireEvent.click(screen.getByText("Deletar"));

    expect(onDeletar).toHaveBeenCalledWith(1);
  });
});
