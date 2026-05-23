package com.crud.livros.controller;

import com.crud.livros.model.Livro;
import com.crud.livros.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "http://localhost:3000")
public class LivroController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "titulo", "autor", "genero", "ano", "status", "avaliacao");

    private final LivroService service;

    public LivroController(LivroService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Livro>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/paginado")
    public ResponseEntity<Page<Livro>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String genero,
            @RequestParam(required = false) String status) {
        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Parâmetro sortBy inválido. Valores permitidos: " + ALLOWED_SORT_FIELDS);
        }

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Livro.Status statusEnum = null;
        if (status != null && !status.isBlank()) {
            try {
                statusEnum = Livro.Status.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Parâmetro status inválido. Valores permitidos: QUERO_LER, LENDO, LIDO");
            }
        }
        return ResponseEntity.ok(service.listarPaginado(busca, genero, statusEnum, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Livro> criar(@Valid @RequestBody Livro livro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(livro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizar(@PathVariable Long id, @Valid @RequestBody Livro livro) {
        return ResponseEntity.ok(service.atualizar(id, livro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/importar")
    public ResponseEntity<List<Livro>> importar(@RequestBody List<Livro> livros) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.importar(livros));
    }
}