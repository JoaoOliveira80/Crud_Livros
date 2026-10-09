package com.entrelinhas.controller;

import com.entrelinhas.dto.EstatisticasResponse;
import com.entrelinhas.dto.ProgressoRequest;
import com.entrelinhas.model.Livro;
import com.entrelinhas.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:3000}")
public class LivroController {
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "titulo", "autor", "genero", "ano", "status", "avaliacao", "paginas", "updatedAt");
    private final LivroService service;

    public LivroController(LivroService service) { this.service = service; }

    @GetMapping
    public List<Livro> listarTodos() { return service.listarTodos(); }

    @GetMapping("/paginado")
    public Page<Livro> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String genero,
            @RequestParam(required = false) String status) {
        if (page < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A página deve ser igual ou maior que zero");
        if (size < 1 || size > 500) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O tamanho da página deve estar entre 1 e 500");
        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parâmetro sortBy inválido");
        if (!sortDir.equalsIgnoreCase("asc") && !sortDir.equalsIgnoreCase("desc"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sortDir deve ser asc ou desc");
        Sort sort = Sort.by(sortBy);
        sort = sortDir.equalsIgnoreCase("asc") ? sort.ascending() : sort.descending();
        Livro.Status statusEnum = null;
        if (status != null && !status.isBlank()) {
            try { statusEnum = Livro.Status.valueOf(status.trim().toUpperCase()); }
            catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parâmetro status inválido"); }
        }
        return service.listarPaginado(busca, genero, statusEnum, PageRequest.of(page, size, sort));
    }

    @GetMapping("/estatisticas")
    public EstatisticasResponse estatisticas() { return service.estatisticas(); }

    @GetMapping("/{id}")
    public Livro buscarPorId(@PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping
    public ResponseEntity<Livro> criar(@Valid @RequestBody Livro livro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(livro));
    }

    @PutMapping("/{id}")
    public Livro atualizar(@PathVariable Long id, @Valid @RequestBody Livro livro) { return service.atualizar(id, livro); }

    @PatchMapping("/{id}/progresso")
    public Livro progresso(@PathVariable Long id, @Valid @RequestBody ProgressoRequest request) {
        return service.atualizarProgresso(id, request.paginaAtual());
    }

    @PatchMapping("/{id}/favorito")
    public Livro favorito(@PathVariable Long id) { return service.alternarFavorito(id); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/importar")
    public ResponseEntity<List<Livro>> importar(@Valid @RequestBody List<@Valid Livro> livros) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.importar(livros));
    }
}
