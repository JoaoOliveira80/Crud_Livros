# Entrelinhas · Dados e persistência

Configuração de banco, dados demonstrativos e cópia de segurança do banco original. Este pacote acompanha tanto o frontend em modo demonstração quanto a API Spring Boot.

## Arquivos incluídos

| Arquivo | Finalidade |
| --- | --- |
| `seed-books.json` | **14 livros de exemplo** para o modo demonstração do frontend |
| `docker-compose.yml` | PostgreSQL 17 local com voentrelinhas persistente |
| `.env.example` | Porta e senha de desenvolvimento do contêiner |
| `schema-postgres.sql` | Criação opcional da tabela `livros`, com índices e constraints |
| `seed-postgres.sql` | 14 registros iniciais opcionais, com deduplicação por título + autor |
| `legacy/livrosdb.mv.db` | Cópia preservada do banco H2 anterior à renovação |

## Estratégias de execução

### 1. Modo demonstração — sem banco externo

No `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_DATA_MODE=demo
```

O frontend lê sua coleção inicial de `frontend/src/lib/demo.json`. A cópia `seed-books.json` deste pacote pode ser consultada/arquivada, mas **não é carregada automaticamente do diretório `data`**. As alterações da demonstração ficam no `localStorage` do navegador e podem ser perdidas ao limpar os dados do site.

### 2. H2 local — padrão do backend

O Spring Boot utiliza, por padrão:

```properties
spring.datasource.url=jdbc:h2:file:./data/livrosdb
```

Partindo da pasta `backend`, o arquivo persistido fica em `backend/data/livrosdb.mv.db`. Não é preciso executar o Docker para criar um novo banco H2.

#### Recuperar o banco antigo

1. **Pare totalmente** a aplicação backend e quaisquer processos que estejam usando o H2.
2. Faça um backup do banco atual, se houver, antes de substituir qualquer arquivo.
3. Copie `legacy/livrosdb.mv.db` para `backend/data/livrosdb.mv.db`.
4. Inicie o backend usando a configuração padrão e verifique os registros.

**Atenção:** o arquivo legado foi preservado como backup e **não foi migrado nem testado contra todas as mudanças**. Faça a primeira inicialização sobre uma cópia descartável. O Hibernate está configurado para atualizar o schema em desenvolvimento, mas isso não substitui um processo de migração e backup.

### 3. PostgreSQL — desenvolvimento full-stack

Requisitos: Docker e Docker Compose.

```bash
# Na pasta data/:
docker compose up -d
# Verifique se está pronto:
docker compose ps
```

A configuração padrão do Compose usa:

| Item | Padrão local |
| --- | --- |
| Banco | `entrelinhas` |
| Usuário | `entrelinhas` |
| Senha | `entrelinhas_dev` |
| Endereço | `localhost:5432` |
| Versão | PostgreSQL 17 Alpine |

Para configurar porta e senha, crie `.env` a partir de `.env.example` **antes de iniciar o contêiner**. Não publique credenciais nem utilize a senha de desenvolvimento em um ambiente exposto à internet.

Inicie o backend em um segundo terminal:

**Linux/macOS/Git Bash:**

```bash
cd backend
SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run
```

**Windows PowerShell:**

```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE = "postgres"
.\mvnw.cmd spring-boot:run
```

No perfil `postgres` de desenvolvimento, o Hibernate cria/atualiza a tabela quando necessário (`DDL_AUTO=update`).

## Schema e dados de exemplo (opcionais)

Para uma instância **nova e vazia**, você também pode aplicar primeiro `schema-postgres.sql` e depois `seed-postgres.sql`. A ordem importa: o seed pressupõe a tabela `livros`.

Em Bash/Git Bash, partindo de `data/`, com o serviço Compose já iniciado:

```bash
docker compose exec -T postgres psql -U entrelinhas -d entrelinhas < schema-postgres.sql
docker compose exec -T postgres psql -U entrelinhas -d entrelinhas < seed-postgres.sql
```

No Windows PowerShell, use o Git Bash para os comandos com redirecionamento `<` acima, ou outro cliente PostgreSQL capaz de executar arquivos SQL. `seed-postgres.sql` evita inserir novamente combinações de título e autor já cadastradas.

> **Importante:** se optar pelo schema SQL explícito, use `DDL_AUTO=validate` depois de aplicar as tabelas e índices. Não misture alterações manuais de schema com atualizações automáticas em ambientes de produção. Considere Flyway/Liquibase antes de tratar este projeto como sistema real.

Para parar os serviços sem excluir o voentrelinhas:

```bash
docker compose down
```

`docker compose down -v` **remove também os dados persistidos do voentrelinhas** — use apenas se desejar descartar o banco local.

## Compatibilidade de campos

Os dados originais do CRUD continuam representados por `titulo`, `autor`, `genero`, `ano`, `descricao`, `status` e `avaliacao`. A renovação acrescentou `paginas`, `paginaAtual`, `favorito`, `notas`, `isbn` e timestamps.

Na API/JSON, os nomes usam `camelCase` (como `paginaAtual`); no PostgreSQL, as colunas do schema usam `snake_case` (como `pagina_atual`).

## Limitações e segurança

- O modo demonstração não sincroniza dados entre navegadores.
- O backend não implementa autenticação nem bibliotecas separadas por usuário.
- O banco H2 legado foi mantido por segurança, não como migração já homologada.
- O schema SQL é uma base opcional; **não há sistema de migrações versionadas** nesta entrega.

---

**Entrelinhas** · [README principal](../README.md) · [API Spring Boot](../backend/README.md)
