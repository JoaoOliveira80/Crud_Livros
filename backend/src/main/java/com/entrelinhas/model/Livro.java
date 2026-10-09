package com.entrelinhas.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/** Book catalogue entry. Existing columns are preserved for compatibility with legacy H2 data. */
@Entity
@Table(name = "livros", indexes = {
        @Index(name = "idx_livros_status", columnList = "status"),
        @Index(name = "idx_livros_genero", columnList = "genero")
})
public class Livro {
    public enum Status { QUERO_LER, LENDO, LIDO }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório") @Size(max = 180)
    @Column(nullable = false, length = 180)
    private String titulo;

    @NotBlank(message = "Autor é obrigatório") @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String autor;

    @NotBlank(message = "Gênero é obrigatório") @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String genero;

    @NotNull(message = "Ano é obrigatório") @Min(1000) @Max(2100)
    private Integer ano;

    @Size(max = 2000) @Column(length = 2000)
    private String descricao;

    @NotNull(message = "Status de leitura é obrigatório")
    @Enumerated(EnumType.STRING) @Column(length = 24)
    private Status status = Status.QUERO_LER;

    @Min(0) @Max(5)
    private Integer avaliacao;

    @Min(value = 1, message = "O número de páginas deve ser positivo")
    private Integer paginas;

    @Min(value = 0, message = "A página atual não pode ser negativa")
    private Integer paginaAtual = 0;

    // Nullable to preserve compatibility with existing H2 databases; legacy NULL means false.
    @Column
    private Boolean favorito = false;

    @Size(max = 3000) @Column(length = 3000)
    private String notas;

    @Size(max = 20)
    private String isbn;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @AssertTrue(message = "O progresso não pode ultrapassar o total de páginas")
    @Transient
    public boolean isProgressoValido() {
        return paginas == null || paginaAtual == null || paginaAtual <= paginas;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (paginaAtual == null) paginaAtual = 0;
        if (favorito == null) favorito = false;
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Integer getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Integer avaliacao) { this.avaliacao = avaliacao; }
    public Integer getPaginas() { return paginas; }
    public void setPaginas(Integer paginas) { this.paginas = paginas; }
    public Integer getPaginaAtual() { return paginaAtual; }
    public void setPaginaAtual(Integer paginaAtual) { this.paginaAtual = paginaAtual; }
    public Boolean getFavorito() { return favorito; }
    public void setFavorito(Boolean favorito) { this.favorito = favorito; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
