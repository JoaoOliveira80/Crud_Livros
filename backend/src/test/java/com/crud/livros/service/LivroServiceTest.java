package com.crud.livros.service;

import com.crud.livros.exception.LivroNotFoundException;
import com.crud.livros.model.Livro;
import com.crud.livros.repository.LivroRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LivroServiceTest {

    @Mock
    private LivroRepository repository;

    @InjectMocks
    private LivroService service;

    private Livro livro;

    @BeforeEach
    void setUp() {
        livro = new Livro();
        livro.setId(1L);
        livro.setTitulo("Dom Casmurro");
        livro.setAutor("Machado de Assis");
        livro.setGenero("Romance");
        livro.setAno(1899);
        livro.setDescricao("Clássico da literatura brasileira");
        livro.setStatus(Livro.Status.QUERO_LER);
        livro.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void listarTodos_deveRetornarListaOrdenada() {
        when(repository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(livro));

        List<Livro> resultado = service.listarTodos();

        assertEquals(1, resultado.size());
        assertEquals("Dom Casmurro", resultado.get(0).getTitulo());
        verify(repository).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void listarPaginado_deveRetornarPagina() {
        Page<Livro> page = new PageImpl<>(List.of(livro));
        PageRequest pageable = PageRequest.of(0, 12, Sort.by("createdAt").descending());
        when(repository.buscarComFiltros(any(), any(), any(), any(PageRequest.class))).thenReturn(page);

        Page<Livro> resultado = service.listarPaginado(null, null, null, pageable);

        assertEquals(1, resultado.getContent().size());
        verify(repository).buscarComFiltros(null, null, null, pageable);
    }

    @Test
    void listarPaginado_comBusca_devePassarParametros() {
        Page<Livro> page = new PageImpl<>(List.of(livro));
        PageRequest pageable = PageRequest.of(0, 12);
        when(repository.buscarComFiltros(eq("Machado"), isNull(), isNull(), any(PageRequest.class))).thenReturn(page);

        Page<Livro> resultado = service.listarPaginado("Machado", null, null, pageable);

        assertEquals(1, resultado.getContent().size());
    }

    @Test
    void listarPaginado_comBuscaVazia_devePassarNull() {
        Page<Livro> page = new PageImpl<>(List.of(livro));
        PageRequest pageable = PageRequest.of(0, 12);
        when(repository.buscarComFiltros(isNull(), isNull(), isNull(), any(PageRequest.class))).thenReturn(page);

        service.listarPaginado("", "", null, pageable);

        verify(repository).buscarComFiltros(null, null, null, pageable);
    }

    @Test
    void buscarPorId_quandoExiste_deveRetornarLivro() {
        when(repository.findById(1L)).thenReturn(Optional.of(livro));

        Livro resultado = service.buscarPorId(1L);

        assertEquals("Dom Casmurro", resultado.getTitulo());
    }

    @Test
    void buscarPorId_quandoNaoExiste_deveLancarExcecao() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(LivroNotFoundException.class, () -> service.buscarPorId(99L));
    }

    @Test
    void criar_deveSalvarERetornarLivro() {
        when(repository.save(any(Livro.class))).thenReturn(livro);

        Livro resultado = service.criar(livro);

        assertEquals("Dom Casmurro", resultado.getTitulo());
        verify(repository).save(livro);
    }

    @Test
    void atualizar_deveAtualizarTodosOsCampos() {
        Livro dados = new Livro();
        dados.setTitulo("Memórias Póstumas");
        dados.setAutor("Machado de Assis");
        dados.setGenero("Romance");
        dados.setAno(1881);
        dados.setDescricao("Outro clássico");
        dados.setStatus(Livro.Status.LIDO);
        dados.setAvaliacao(5);

        when(repository.findById(1L)).thenReturn(Optional.of(livro));
        when(repository.save(any(Livro.class))).thenAnswer(inv -> inv.getArgument(0));

        Livro resultado = service.atualizar(1L, dados);

        assertEquals("Memórias Póstumas", resultado.getTitulo());
        assertEquals(1881, resultado.getAno());
        assertEquals(Livro.Status.LIDO, resultado.getStatus());
        assertEquals(5, resultado.getAvaliacao());
    }

    @Test
    void atualizar_quandoNaoExiste_deveLancarExcecao() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(LivroNotFoundException.class, () -> service.atualizar(99L, livro));
    }

    @Test
    void deletar_deveRemoverLivro() {
        when(repository.findById(1L)).thenReturn(Optional.of(livro));
        doNothing().when(repository).delete(any(Livro.class));

        service.deletar(1L);

        verify(repository).delete(livro);
    }

    @Test
    void deletar_quandoNaoExiste_deveLancarExcecao() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(LivroNotFoundException.class, () -> service.deletar(99L));
    }

    @Test
    void importar_deveFiltrarDuplicatas() {
        Livro duplicado = new Livro();
        duplicado.setTitulo("Dom Casmurro");
        duplicado.setAutor("Machado de Assis");

        Livro novo = new Livro();
        novo.setTitulo("O Alienista");
        novo.setAutor("Machado de Assis");
        novo.setGenero("Conto");
        novo.setAno(1882);

        when(repository.existsByTituloAndAutor("Dom Casmurro", "Machado de Assis")).thenReturn(true);
        when(repository.existsByTituloAndAutor("O Alienista", "Machado de Assis")).thenReturn(false);
        when(repository.saveAll(anyList())).thenReturn(List.of(novo));

        List<Livro> resultado = service.importar(Arrays.asList(duplicado, novo));

        assertEquals(1, resultado.size());
        assertEquals("O Alienista", resultado.get(0).getTitulo());
        verify(repository).saveAll(argThat((List<Livro> list) -> list.size() == 1));
    }

    @Test
    void importar_todosDuplicados_deveRetornarListaVazia() {
        Livro duplicado = new Livro();
        duplicado.setTitulo("Dom Casmurro");
        duplicado.setAutor("Machado de Assis");

        when(repository.existsByTituloAndAutor(anyString(), anyString())).thenReturn(true);
        when(repository.saveAll(anyList())).thenReturn(List.of());

        List<Livro> resultado = service.importar(List.of(duplicado));

        assertTrue(resultado.isEmpty());
    }
}
