package com.crud.livros.repository;

import com.crud.livros.model.Livro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
    List<Livro> findAllByOrderByCreatedAtDesc();

    boolean existsByTituloAndAutor(String titulo, String autor);

    @Query("SELECT l FROM Livro l WHERE " +
           "(:busca IS NULL OR LOWER(l.titulo) LIKE LOWER(CONCAT('%', :busca, '%')) OR LOWER(l.autor) LIKE LOWER(CONCAT('%', :busca, '%'))) AND " +
           "(:genero IS NULL OR l.genero = :genero) AND " +
           "(:status IS NULL OR l.status = :status)")
    Page<Livro> buscarComFiltros(@Param("busca") String busca,
                                  @Param("genero") String genero,
                                  @Param("status") Livro.Status status,
                                  Pageable pageable);
}