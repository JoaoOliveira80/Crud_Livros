# Entrelinhas · Frontend

**Uma biblioteca digital com identidade editorial, focada na experiência de leitura.**

![Next.js](https://img.shields.io/badge/Next.js-16-111827?logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

> Este diretório pode ser executado de forma independente no **modo demonstração**, sem API nem banco de dados. Para a visão completa do projeto, leia o [README principal](../README.md), quando presente em um monorepo.

## O que o frontend entrega?

- **Dashboard** com visão geral do acervo, leituras em andamento, favoritos e meta anual;
- **Biblioteca** com busca, filtros por gênero/status/favoritos, ordenação, paginação e visualização em grade ou lista;
- **Cadastro e edição** de livros com título, autor, gênero, ISBN, ano, páginas, status, notas e avaliação;
- **Acompanhamento de progresso** em páginas e ações rápidas para avançar a leitura;
- **Estatísticas** de gêneros, progresso, avaliações e objetivo anual;
- **Preferências** de tema claro/escuro, meta, importação/exportação JSON e restauração da demonstração;
- **Interface responsiva** com microinterações e respeito à preferência de redução de movimento.

### Rotas

| Rota | Conteúdo |
| --- | --- |
| `/` | Painel inicial |
| `/biblioteca` | Acervo, busca, filtros e ações |
| `/estatisticas` | Indicadores e metas |
| `/configuracoes` | Tema, meta, importação e exportação |

As capas são ilustrativas e criadas via CSS; o funcionamento principal não exige serviço de imagens externo.

## Executar localmente

**Requisito recomendado:** Node.js 22 + npm.

```bash
npm ci
npm run dev
```

Acesse **http://localhost:3000**. O modo padrão é `demo` e começa com **14 livros ilustrativos**.

### Escolhendo a fonte de dados

Crie `.env.local` a partir de `.env.example`.

**Opção A — Demonstração (ideal para portfólio):**

```dotenv
NEXT_PUBLIC_DATA_MODE=demo
```

- Sem backend e sem configuração de banco.
- Livros editados/cadastrados são armazenados no `localStorage` **desse navegador** (`entrelinhas-library-v2`).
- Preferências de tema e meta também ficam locais; não há login nem sincronização entre dispositivos.
- Na página de configurações, é possível exportar dados ou restaurar os exemplos.

**Opção B — API Spring Boot:**

```dotenv
NEXT_PUBLIC_DATA_MODE=api
NEXT_PUBLIC_API_URL=http://localhost:8080/api/livros
```

- Inicie o backend separadamente (veja [`backend/README.md`](../backend/README.md), quando presente).
- O frontend envia as operações do catálogo à API REST.
- Se a conexão falhar na carga inicial, a interface avisa e carrega a demonstração local, permitindo tentar reconectar em Configurações.
- Use uma API HTTPS, acessível publicamente, ao implantar o frontend na web; configure a origem permitida no backend via `CORS_ALLOWED_ORIGIN`.

> Variáveis `NEXT_PUBLIC_*` ficam expostas no bundle do navegador. Não insira senhas ou segredos nelas. Reinicie o servidor de desenvolvimento após alterar `.env.local`.

## Organização do código

```text
src/
├── app/                # Páginas Next.js App Router e estilos globais
├── components/entrelinhas/    # Shell, cartões, editor e visualização de livros
├── contexts/           # Estado da biblioteca e preferências (LibraryContext)
├── lib/                # Dados iniciais e funções de estatística
├── services/           # Comunicação tipada com a API REST
└── types/              # Contratos TypeScript
```

### Escolhas de implementação

| Decisão | Motivação |
| --- | --- |
| **Next.js App Router** | Organização por páginas e rotas de aplicação |
| **TypeScript** | Contratos explícitos para livros, formulário e serviços |
| **React Context** | Estado compartilhado sem dependências adicionais de gerenciamento |
| **Camada de serviços** | Isolar acesso HTTP das telas e dos componentes |
| **Modo demonstração** | Permitir avaliação pública do portfólio sem infraestrutura |
| **CSS e ilustrações locais** | Dar personalidade visual sem dependência de imagens remotas |

## Qualidade e scripts

```bash
npm run lint            # ESLint
npx tsc --noEmit        # Checagem de tipos
npm test -- --runInBand # Jest + Testing Library
npm run build           # Build de produção
npm run start           # Serve o build criado
```

A verificação estática com TypeScript e ESLint foi concluída sem erros no ambiente de preparação. A execução do Jest e o build de produção não puderam ser concluídos ali por limitações de download de dependências/binários. **Execute todos os checks no seu ambiente ou na CI antes de afirmar que estão passando.**

O ZIP não inclui `node_modules`, `.next` nem caches; rode `npm ci` após extrair.

## Deploy na Vercel

1. Faça push do frontend para o GitHub (repo isolado ou monorepo).
2. Importe o projeto na Vercel e, se for monorepo, configure **Root Directory = `frontend`**.
3. Selecione modo demo com `NEXT_PUBLIC_DATA_MODE=demo`.
4. Execute o deploy; não é necessário backend para essa versão pública.

Para modo API, configure `NEXT_PUBLIC_API_URL` com HTTPS e uma API provisionada separadamente. O backend de demonstração não implementa autenticação; não o disponibilize abertamente com dados sensíveis.

## Limites conhecidos

- Modo demonstração é local ao navegador e pode ser apagado ao limpar o armazenamento.
- O modo API compartilha um único acervo, pois a API não possui autenticação/multiusuário.
- Metas e tema são preferências locais, não dados sincronizados na API.
- Não há testes end-to-end ou garantia formal de conformidade integral WCAG nesta entrega.

---

**Entrelinhas · Ateliê de Leitura** · [Voltar à apresentação](../README.md)
