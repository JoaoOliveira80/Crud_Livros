-- Optional demonstration records, safe to re-run (deduplicates by title and author).
INSERT INTO livros (titulo, autor, genero, ano, descricao, status, avaliacao, paginas, pagina_atual, favorito, notas, created_at, updated_at)
SELECT v.titulo, v.autor, v.genero, v.ano, v.descricao, v.status, v.avaliacao, v.paginas, v.pagina_atual, v.favorito, v.notas, v.created_at::timestamp, v.updated_at::timestamp FROM (VALUES
('A biblioteca da meia-noite', 'Matt Haig', 'Ficção', 2020, 'Uma história sobre arrependimentos, possibilidades e recomeços.', 'LENDO', NULL, 308, 186, TRUE, 'Cada escolha abre uma vida possível.', '2026-02-12 12:00:00', '2026-09-02 12:00:00'),
('Duna', 'Frank Herbert', 'Ficção científica', 1965, 'Política, ecologia e destino em um planeta de areia.', 'LENDO', NULL, 680, 420, TRUE, 'A construção de mundo me impressionou.', '2026-03-13 12:00:00', '2026-09-03 12:00:00'),
('Torto arado', 'Itamar Vieira Junior', 'Literatura brasileira', 2019, 'Duas irmãs, memória e pertencimento no sertão brasileiro.', 'LIDO', 5, 264, 264, TRUE, 'Uma das leituras mais marcantes do ano.', '2026-04-14 12:00:00', '2026-09-04 12:00:00'),
('O homem que calculava', 'Malba Tahan', 'Clássicos', 1938, 'Enigmas e aventuras através da arte de contar histórias.', 'LIDO', 4, 304, 304, FALSE, 'Matemática contada com afeto e curiosidade.', '2026-05-15 12:00:00', '2026-09-05 12:00:00'),
('O nome do vento', 'Patrick Rothfuss', 'Fantasia', 2007, 'Um músico conta a história por trás de sua própria lenda.', 'QUERO_LER', NULL, 656, 0, TRUE, '', '2026-06-16 12:00:00', '2026-09-06 12:00:00'),
('Pessoas normais', 'Sally Rooney', 'Romance', 2018, 'Uma relação complexa entre afeto, classe e amadurecimento.', 'LIDO', 4, 264, 264, FALSE, 'Diálogos muito bem construídos.', '2026-07-17 12:00:00', '2026-09-07 12:00:00'),
('Sapiens', 'Yuval Noah Harari', 'Não ficção', 2011, 'Um olhar panorâmico sobre a história da humanidade.', 'QUERO_LER', NULL, 464, 0, FALSE, '', '2026-08-18 12:00:00', '2026-09-08 12:00:00'),
('Ensaio sobre a cegueira', 'José Saramago', 'Clássicos', 1995, 'Uma epidemia inexplicável revela a fragilidade da vida em sociedade.', 'LIDO', 5, 312, 312, TRUE, 'A escrita de Saramago é única.', '2026-09-11 12:00:00', '2026-09-09 12:00:00'),
('O hobbit', 'J. R. R. Tolkien', 'Fantasia', 1937, 'Uma jornada inesperada além das colinas conhecidas.', 'LIDO', 5, 336, 336, TRUE, 'Sempre vale revisitar a Terra-média.', '2026-01-12 12:00:00', '2026-09-10 12:00:00'),
('Hábitos atômicos', 'James Clear', 'Desenvolvimento', 2018, 'Pequenas mudanças práticas e seus efeitos ao longo do tempo.', 'QUERO_LER', NULL, 320, 0, FALSE, '', '2026-02-13 12:00:00', '2026-09-11 12:00:00'),
('Dom Casmurro', 'Machado de Assis', 'Literatura brasileira', 1899, 'Memória, ciúme e ambiguidade na literatura brasileira.', 'LIDO', 5, 256, 256, FALSE, 'Narrador fascinante e pouco confiável.', '2026-03-14 12:00:00', '2026-09-12 12:00:00'),
('A metamorfose', 'Franz Kafka', 'Clássicos', 1915, 'O estranho encontra o cotidiano em uma narrativa inesquecível.', 'QUERO_LER', NULL, 96, 0, FALSE, '', '2026-04-15 12:00:00', '2026-09-13 12:00:00'),
('O pequeno príncipe', 'Antoine de Saint-Exupéry', 'Clássicos', 1943, 'Um viajante descobre o que realmente importa.', 'LIDO', 5, 96, 96, FALSE, 'Simples e profundo ao mesmo tempo.', '2026-05-16 12:00:00', '2026-09-14 12:00:00'),
('Tudo é rio', 'Carla Madeira', 'Literatura brasileira', 2014, 'Um romance sobre amor, perdas e transformação.', 'QUERO_LER', NULL, 210, 0, FALSE, '', '2026-06-17 12:00:00', '2026-09-15 12:00:00')
) AS v(titulo,autor,genero,ano,descricao,status,avaliacao,paginas,pagina_atual,favorito,notas,created_at,updated_at)
WHERE NOT EXISTS (SELECT 1 FROM livros l WHERE lower(l.titulo)=lower(v.titulo) AND lower(l.autor)=lower(v.autor));
