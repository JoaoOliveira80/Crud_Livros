package com.entrelinhas.service;

import com.entrelinhas.model.Livro;
import com.entrelinhas.repository.LivroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LivroFeaturesTest {
    private LivroRepository repository;
    private LivroService service;
    private Livro livro;

    @BeforeEach void setUp() {
        repository = mock(LivroRepository.class);
        service = new LivroService(repository);
        livro = new Livro(); livro.setId(1L); livro.setTitulo("Duna");
        livro.setAutor("Frank Herbert"); livro.setGenero("Ficção"); livro.setAno(1965);
        livro.setPaginas(400); livro.setPaginaAtual(100); livro.setStatus(Livro.Status.LENDO);
    }

    @Test void progressoConcluidoAtualizaStatus() {
        when(repository.findById(1L)).thenReturn(Optional.of(livro));
        when(repository.save(livro)).thenReturn(livro);
        Livro atualizado = service.atualizarProgresso(1L, 400);
        assertEquals(Livro.Status.LIDO, atualizado.getStatus());
        assertEquals(400, atualizado.getPaginaAtual());
    }

    @Test void progressoNaoPodeUltrapassarPaginas() {
        when(repository.findById(1L)).thenReturn(Optional.of(livro));
        assertThrows(ResponseStatusException.class, () -> service.atualizarProgresso(1L, 500));
        verify(repository, never()).save(any());
    }

    @Test void alternarFavoritoPersisteMudanca() {
        when(repository.findById(1L)).thenReturn(Optional.of(livro));
        when(repository.save(livro)).thenReturn(livro);
        assertTrue(service.alternarFavorito(1L).getFavorito());
    }

    @Test void estatisticasNaoContamComoLidosLivrosEmAndamento() {
        when(repository.findAll()).thenReturn(List.of(livro));
        var stats = service.estatisticas();
        assertEquals(1, stats.total()); assertEquals(1, stats.lendo());
        assertEquals(100, stats.paginasLidas()); assertEquals(0, stats.lidos());
    }
}
