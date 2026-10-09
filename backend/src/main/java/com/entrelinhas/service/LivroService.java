package com.entrelinhas.service;

import com.entrelinhas.dto.EstatisticasResponse;
import com.entrelinhas.exception.LivroNotFoundException;
import com.entrelinhas.model.Livro;
import com.entrelinhas.repository.LivroRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class LivroService {
    private final LivroRepository repository;

    public LivroService(LivroRepository repository) { this.repository = repository; }

    public List<Livro> listarTodos() { return repository.findAllByOrderByCreatedAtDesc(); }

    public Page<Livro> listarPaginado(String busca, String genero, Livro.Status status, Pageable pageable) {
        return repository.buscarComFiltros(
                busca == null || busca.isBlank() ? null : busca.trim(),
                genero == null || genero.isBlank() ? null : genero.trim(), status, pageable);
    }

    public Livro buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new LivroNotFoundException(id));
    }

    @Transactional
    public Livro criar(Livro livro) {
        livro.setId(null); livro.setCreatedAt(null); livro.setUpdatedAt(null);
        return repository.save(livro);
    }

    @Transactional
    public Livro atualizar(Long id, Livro dados) {
        Livro livro = buscarPorId(id);
        livro.setTitulo(dados.getTitulo());
        livro.setAutor(dados.getAutor());
        livro.setGenero(dados.getGenero());
        livro.setAno(dados.getAno());
        livro.setDescricao(dados.getDescricao());
        livro.setStatus(dados.getStatus());
        livro.setAvaliacao(dados.getAvaliacao());
        livro.setPaginas(dados.getPaginas());
        livro.setPaginaAtual(dados.getPaginaAtual());
        livro.setFavorito(dados.getFavorito() == null ? false : dados.getFavorito());
        livro.setNotas(dados.getNotas());
        livro.setIsbn(dados.getIsbn());
        validarProgresso(livro);
        return repository.save(livro);
    }

    @Transactional
    public Livro atualizarProgresso(Long id, int paginaAtual) {
        Livro livro = buscarPorId(id);
        if (livro.getPaginas() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o total de páginas antes de registrar progresso");
        }
        livro.setPaginaAtual(paginaAtual);
        validarProgresso(livro);
        if (paginaAtual == livro.getPaginas()) livro.setStatus(Livro.Status.LIDO);
        else if (paginaAtual > 0) livro.setStatus(Livro.Status.LENDO);
        return repository.save(livro);
    }

    @Transactional
    public Livro alternarFavorito(Long id) {
        Livro livro = buscarPorId(id);
        livro.setFavorito(!Boolean.TRUE.equals(livro.getFavorito()));
        return repository.save(livro);
    }

    @Transactional
    public void deletar(Long id) { repository.delete(buscarPorId(id)); }

    @Transactional
    public List<Livro> importar(List<Livro> livros) {
        if (livros == null || livros.isEmpty() || livros.size() > 500 || livros.stream().anyMatch(Objects::isNull)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie de 1 a 500 livros válidos");
        }
        Set<String> vistos = repository.findAll().stream()
                .map(this::chave).collect(Collectors.toSet());
        List<Livro> novos = new ArrayList<>();
        for (Livro livro : livros) {
            validarProgresso(livro);
            if (vistos.add(chave(livro))) {
                livro.setId(null); livro.setCreatedAt(null); livro.setUpdatedAt(null);
                novos.add(livro);
            }
        }
        return repository.saveAll(novos);
    }

    private String chave(Livro livro) {
        return (livro.getTitulo().trim() + "|" + livro.getAutor().trim()).toLowerCase(Locale.ROOT);
    }

    private void validarProgresso(Livro livro) {
        if (livro.getPaginaAtual() != null && (livro.getPaginaAtual() < 0 ||
                (livro.getPaginas() != null && livro.getPaginaAtual() > livro.getPaginas()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O progresso precisa estar entre 0 e o total de páginas");
        }
    }

    public EstatisticasResponse estatisticas() {
        List<Livro> livros = repository.findAll();
        long lidos = livros.stream().filter(l -> l.getStatus() == Livro.Status.LIDO).count();
        long lendo = livros.stream().filter(l -> l.getStatus() == Livro.Status.LENDO).count();
        long favoritos = livros.stream().filter(l -> Boolean.TRUE.equals(l.getFavorito())).count();
        long paginas = livros.stream().mapToLong(l -> l.getPaginas() == null ? 0 : l.getPaginas()).sum();
        long progresso = livros.stream().mapToLong(l -> l.getPaginaAtual() == null ? 0 : l.getPaginaAtual()).sum();
        double media = livros.stream().filter(l -> l.getAvaliacao() != null)
                .mapToInt(Livro::getAvaliacao).average().orElse(0);
        Map<String, Long> porGenero = livros.stream().collect(Collectors.groupingBy(
                Livro::getGenero, Collectors.counting()));
        return new EstatisticasResponse(livros.size(), lidos, lendo, livros.size() - lidos - lendo,
                favoritos, progresso, paginas, Math.round(media * 10.0) / 10.0, porGenero);
    }
}
