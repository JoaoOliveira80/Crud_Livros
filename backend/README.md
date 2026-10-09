# Entrelinhas · Backend

**API REST para gerenciamento de livros, progresso de leitura e métricas de uma biblioteca pessoal.**

![Java](https://img.shields.io/badge/Java-21-E76F00?logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-6DB33F?logo=springboot&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)

Evolução da API de um CRUD para uma camada de negócio que também oferece paginação, filtros, importação, favoritos, atualização de progresso e estatísticas.

## Stack e arquitetura

- **Java 21 + Spring Boot 4.0.4** com Spring MVC;
- **Spring Data JPA/Hibernate** para persistência;
- **Bean Validation** para validação de entrada;
- **H2** persistido em arquivo para começar sem infraestrutura;
- **PostgreSQL 17** como alternativa configurável;
- **springdoc OpenAPI** para documentação interativa;
- **Testes** de controller, service e contexto Spring no projeto.

```text
src/main/java/com/entrelinhas/
├── controller/      # Endpoints REST e validação de parâmetros
├── dto/             # Contratos de progresso e estatísticas
├── exception/       # Tratamento de erros e livro não encontrado
├── model/           # Entidade Livro e validações
├── repository/      # Acesso a dados e pesquisa
└── service/         # Regras de negócio e operações transacionais
```

## Executar com H2 (padrão)

**Requisito:** JDK 21. O Maven Wrapper acompanha o projeto.

```bash
./mvnw spring-boot:run
# Em Windows (PowerShell/CMD): .\mvnw.cmd spring-boot:run
```

| Serviço | Endereço |
| --- | --- |
| API | http://localhost:8080/api/livros |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |

O banco fica em `./data/livrosdb.mv.db`, relativo à pasta em que o processo é executado. A pasta `data/` já existe neste pacote. Por padrão, o H2 Console está desativado; para testes locais, configure `H2_CONSOLE_ENABLED=true`.

## Endpoints

Prefixo: **`/api/livros`**.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Listar todos os livros, mais recentes primeiro |
| `GET` | `/paginado` | Pesquisar, filtrar, ordenar e paginar |
| `GET` | `/estatisticas` | Agregados da biblioteca |
| `GET` | `/{id}` | Buscar um livro por ID |
| `POST` | `/` | Criar um livro (201) |
| `PUT` | `/{id}` | Atualizar um livro |
| `PATCH` | `/{id}/progresso` | Atualizar número de páginas lidas |
| `PATCH` | `/{id}/favorito` | Alternar `favorito` |
| `DELETE` | `/{id}` | Excluir livro (204) |
| `POST` | `/importar` | Importar de 1 a 500 livros; ignora duplicatas por título + autor |

### Exemplo: cadastrar um livro

```bash
curl -X POST http://localhost:8080/api/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Duna","autor":"Frank Herbert","genero":"Ficção científica","ano":1965,"status":"LENDO","paginas":680,"paginaAtual":120,"favorito":true}'
```

> Esse exemplo usa a sintaxe de Bash/Git Bash. No PowerShell, é possível enviar JSON com `Invoke-RestMethod` ou consultar o Swagger UI.

### Exemplo: atualizar progresso

```http
PATCH /api/livros/1/progresso
Content-Type: application/json

{"paginaAtual": 240}
```

Se a página atual atingir o total de páginas, o status passa a `LIDO`. Para progresso positivo abaixo do total, o status passa a `LENDO`. `paginaAtual` não pode ultrapassar `paginas`.

### Paginação e filtros

```http
GET /api/livros/paginado?page=0&size=12&busca=duna&status=LENDO&sortBy=titulo&sortDir=asc
```

- `page`: começa em 0;
- `size`: de 1 a 500;
- `busca`: pesquisa textual; `genero`: filtro de gênero;
- `status`: `QUERO_LER`, `LENDO` ou `LIDO`;
- `sortDir`: `asc` ou `desc`;
- `sortBy`: `createdAt`, `titulo`, `autor`, `genero`, `ano`, `status`, `avaliacao`, `paginas` ou `updatedAt`.

### Principais campos do livro

`titulo`, `autor`, `genero`, `ano` e `status` são obrigatórios. Outros campos: `descricao`, `avaliacao` (0–5), `paginas` (maior que 0), `paginaAtual` (maior ou igual a 0), `favorito`, `notas`, `isbn`. IDs e timestamps são gerados/geridos pelo servidor.

## PostgreSQL opcional

O pacote [`data/`](../data/README.md) contém um Compose com PostgreSQL 17.

```bash
# No diretório data/:
docker compose up -d

# No diretório backend/, Linux/macOS/Git Bash:
SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run
```

No PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE="postgres"
.\mvnw.cmd spring-boot:run
```

O perfil utiliza `jdbc:postgresql://localhost:5432/entrelinhas`, usuário `entrelinhas` e senha `entrelinhas_dev` **apenas como valores locais de desenvolvimento**. Sobrescreva-os em ambientes publicados.

| Variável | Padrão | Papel |
| --- | --- | --- |
| `PORT` | `8080` | Porta HTTP |
| `SPRING_PROFILES_ACTIVE` | sem perfil (H2) | Use `postgres` para PostgreSQL |
| `DATABASE_URL` | URL do perfil escolhido | JDBC URL |
| `DATABASE_USER` | `sa` (H2) / `entrelinhas` (Postgres) | Usuário |
| `DATABASE_PASSWORD` | vazio (H2) / `entrelinhas_dev` (Postgres) | Senha |
| `CORS_ALLOWED_ORIGIN` | `http://localhost:3000` | Origem aceita pelo navegador |
| `H2_CONSOLE_ENABLED` | `false` | Console H2 local |
| `DDL_AUTO` | `update` (perfil postgres) | Estratégia Hibernate no perfil postgres |

## Testes

```bash
./mvnw test
./mvnw clean verify
# Windows: .\mvnw.cmd test
```

A suíte está incluída, mas **não foi executada integralmente no ambiente de preparação desta entrega** por restrições de acesso às dependências Maven. Rode os testes e confira o Swagger antes de disponibilizar a API.

## Segurança e produção

Esta API é **single-library**, sem autenticação ou controle de acesso por usuário. Todos os clientes que conseguirem acessá-la operam sobre a mesma coleção. Não a exponha para armazenar dados privados ou de vários usuários sem implementar autenticação, autorização, isolamento de dados e limites de requisição.

Em desenvolvimento, o Hibernate usa `ddl-auto=update` para facilitar testes. Para produção, use migrações versionadas e `validate`, configure CORS e credenciais por ambiente, HTTPS, monitoramento e política de backups. O arquivo H2 legado está preservado separadamente no pacote `data` e não deve ser sobrescrito com a aplicação em execução.

---

**Entrelinhas** · [Documentação principal](../README.md) · [Dados e PostgreSQL](../data/README.md)
