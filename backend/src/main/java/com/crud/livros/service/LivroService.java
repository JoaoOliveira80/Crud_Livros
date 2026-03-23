package com.crud.livros.service;

import com.crud.livros.exception.LivroNotFoundException;
import com.crud.livros.model.Livro;
import com.crud.livros.repository.LivroRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LivroService {

    private final LivroRepository repository;

    public LivroService(LivroRepository repository) {
        this.repository = repository;
    }

    public List<Livro> listarTodos() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Page<Livro> listarPaginado(String busca, String genero, Livro.Status status, Pageable pageable) {
        return repository.buscarComFiltros(
                busca != null && busca.isBlank() ? null : busca,
                genero != null && genero.isBlank() ? null : genero,
                status,
                pageable
        );
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
        livro.setAvaliacao(dados.getAvaliacao());
        return repository.save(livro);
    }

    public void deletar(Long id) {
        repository.delete(buscarPorId(id));
    }

    public List<Livro> importar(List<Livro> livros) {
        List<Livro> novos = livros.stream()
                .filter(l -> !repository.existsByTituloAndAutor(l.getTitulo(), l.getAutor()))
                .collect(Collectors.toList());
        return repository.saveAll(novos);
    }
}