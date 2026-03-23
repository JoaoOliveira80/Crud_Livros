package com.crud.livros.controller;

import com.crud.livros.exception.GlobalExceptionHandler;
import com.crud.livros.exception.LivroNotFoundException;
import com.crud.livros.model.Livro;
import com.crud.livros.service.LivroService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LivroController.class)
@Import(GlobalExceptionHandler.class)
class LivroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LivroService service;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private Livro livro;

    @BeforeEach
    void setUp() {
        livro = new Livro();
        livro.setId(1L);
        livro.setTitulo("Dom Casmurro");
        livro.setAutor("Machado de Assis");
        livro.setGenero("Romance");
        livro.setAno(1899);
        livro.setStatus(Livro.Status.QUERO_LER);
        livro.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void listarTodos_deveRetornar200ELista() throws Exception {
        when(service.listarTodos()).thenReturn(List.of(livro));

        mockMvc.perform(get("/api/livros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].titulo", is("Dom Casmurro")));
    }

    @Test
    void listarPaginado_deveRetornar200EPagina() throws Exception {
        Page<Livro> page = new PageImpl<>(List.of(livro), PageRequest.of(0, 12), 1);
        when(service.listarPaginado(any(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/livros/paginado")
                        .param("page", "0")
                        .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.content[0].titulo", is("Dom Casmurro")));
    }

    @Test
    void listarPaginado_comFiltros_devePassarParametros() throws Exception {
        Page<Livro> page = new PageImpl<>(List.of(livro));
        when(service.listarPaginado(eq("Machado"), eq("Romance"), eq(Livro.Status.QUERO_LER), any()))
                .thenReturn(page);

        mockMvc.perform(get("/api/livros/paginado")
                        .param("busca", "Machado")
                        .param("genero", "Romance")
                        .param("status", "QUERO_LER"))
                .andExpect(status().isOk());
    }

    @Test
    void buscarPorId_quandoExiste_deveRetornar200() throws Exception {
        when(service.buscarPorId(1L)).thenReturn(livro);

        mockMvc.perform(get("/api/livros/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo", is("Dom Casmurro")));
    }

    @Test
    void buscarPorId_quandoNaoExiste_deveRetornar404() throws Exception {
        when(service.buscarPorId(99L)).thenThrow(new LivroNotFoundException(99L));

        mockMvc.perform(get("/api/livros/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.erro", containsString("99")));
    }

    @Test
    void criar_comDadosValidos_deveRetornar201() throws Exception {
        when(service.criar(any(Livro.class))).thenReturn(livro);

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(livro)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo", is("Dom Casmurro")));
    }

    @Test
    void criar_comTituloVazio_deveRetornar400() throws Exception {
        livro.setTitulo("");

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(livro)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro", containsString("Título")));
    }

    @Test
    void criar_comAutorVazio_deveRetornar400() throws Exception {
        livro.setAutor("");

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(livro)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro", containsString("Autor")));
    }

    @Test
    void criar_comAnoNulo_deveRetornar400() throws Exception {
        livro.setAno(null);

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(livro)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro", containsString("Ano")));
    }

    @Test
    void atualizar_deveRetornar200() throws Exception {
        livro.setTitulo("Memórias Póstumas");
        when(service.atualizar(eq(1L), any(Livro.class))).thenReturn(livro);

        mockMvc.perform(put("/api/livros/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(livro)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo", is("Memórias Póstumas")));
    }

    @Test
    void deletar_deveRetornar204() throws Exception {
        doNothing().when(service).deletar(1L);

        mockMvc.perform(delete("/api/livros/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void importar_deveRetornar201() throws Exception {
        when(service.importar(anyList())).thenReturn(List.of(livro));

        mockMvc.perform(post("/api/livros/importar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(livro))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$", hasSize(1)));
    }
}
