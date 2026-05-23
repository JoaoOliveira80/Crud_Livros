# Minha Estante — CRUD de Livros

Aplicação full stack para catalogar e acompanhar sua biblioteca pessoal.

## Stack

- **Backend:** Spring Boot, JPA, H2 (memória)
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4

## Como executar

### Backend (porta 8080)

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

API: `http://localhost:8080/api/livros`  
Swagger (se habilitado): `http://localhost:8080/swagger-ui.html`

### Frontend (porta 3000)

```bash
cd frontend
npm install
cp .env.example .env.local   # opcional — ajuste a URL da API
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente (frontend)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/livros` | URL base da API |

## Testes

```bash
# Backend
cd backend && ./mvnw test

# Frontend
cd frontend && npm test
```

## Rotas do frontend

| Rota | Descrição |
|------|-----------|
| `/` | Painel curatorial por status de leitura |
| `/biblioteca` | Grade paginada com filtros |
| `/configuracoes` | Estatísticas e preferências |
