package com.crud.livros.service;

import com.crud.livros.exception.LivroNotFoundException;
import com.crud.livros.model.Livro;
import com.crud.livros.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    private final LivroRepository repository;

    public LivroService(LivroRepository repository) {
        this.repository = repository;
    }

    public List<Livro> listarTodos() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Livro buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new LivroNotFoundException(id));
    }

    public Livro criar(Livro livro) {
        return repository.save(livro);
    }

    public Livro atualizar(Long id, Livro dados) {
        Livro livro = buscarPorId(id);
        livro.setTitulo(dados.getTitulo());
        livro.setAutor(dados.getAutor());
        livro.setGenero(dados.getGenero());
        livro.setAno(dados.getAno());
        livro.setDescricao(dados.getDescricao());
        livro.setStatus(dados.getStatus());
        return repository.save(livro);
    }

    public void deletar(Long id) {
        repository.delete(buscarPorId(id));
    }
}