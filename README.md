# RestôDonte — Sistema de Restaurante

Aplicativo completo para gestão de restaurante com backend Node/Express + Sequelize/PostgreSQL (migrações, triggers e stored procedures) e frontend React Native (Expo).

- Backend: API REST com autenticação JWT, cardápio, comandas, produção e relatórios.
- Frontend: app móvel/web em React Native (Expo) consumindo a API.

## Sumário
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Instalação e execução](#instalação-e-execução)
- [Scripts úteis](#scripts-úteis)
- [API — Endpoints principais](#api--endpoints-principais)
- [Banco de dados — Migrações, Triggers e Stored Procedures](#banco-de-dados--migrações-triggers-e-stored-procedures)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Licença](#licença)

## Arquitetura

Frontend (React Native/Expo) → API (Express) → Serviços (Regras de negócio) → Sequelize (Models) → PostgreSQL

- Base path da API: `/api`
- Fluxo típico: Tela → `frontend/src/api/api.js` → Rotas → Controladores → Serviços → Models → Banco

## Tecnologias

Backend
- Node.js, Express 5
- Sequelize 6, sequelize-cli
- PostgreSQL (dialeto `pg`)
- Autenticação JWT (`jsonwebtoken`), hashing de senhas (`bcrypt`)
- CORS, dotenv
- Nodemon (dev)

Frontend
- React 19, React Native 0.81, Expo 54
- React Navigation (stack/bottom-tabs)
- Axios
- AsyncStorage
- React Native Web

## Configuração do ambiente

Pré‑requisitos
- Node.js LTS e npm
- PostgreSQL 13+ (local ou remoto)
- Expo CLI (global) opcional para rodar no dispositivo/emulador

Variáveis de ambiente — Backend (`backend/.env`)

Veja `backend/.env.example` como referência. Principais variáveis:
- API_PORT (padrão 3333)
- HOST (padrão 0.0.0.0)
- FRONTEND_URL (origem autorizada em produção)
- INSTANCE_PUBLIC_IP (para logs)
- NODE_ENV (development|production)
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- DB_SSL ("true" para habilitar SSL)
- JWT_SECRET (obrigatório)

Variáveis de ambiente — Frontend (`frontend/.env` ou variáveis públicas Expo)

Veja `frontend/.env.example`.
- EXPO_PUBLIC_ENV (local|emulador|production)
- EXPO_PUBLIC_API_URL (quando usar production)

Configuração da conexão (Sequelize)
- Arquivo: `backend/src/config/database.js`
- Caminhos do CLI: `backend/.sequelizerc`

## Instalação e execução

1) Clonar repositório

```bash
git clone <URL_DO_REPO>
cd restoDonte
```

2) Backend

```bash
cd backend
npm install
# copiar e ajustar variáveis
cp .env.example .env
# criar banco (no psql)
#   CREATE DATABASE restodonte;
# migrar e popular
npm run db:migrate
npm run db:seed
# opcional: testar conexão
npm run db:test
# rodar servidor
npm run dev
# API: http://localhost:3333/api
```

3) Frontend

```bash
cd ../frontend
npm install
# copiar e ajustar ambiente
cp .env.example .env
# iniciar Expo
npm start
# abrir no Android/iOS/web conforme necessidade
```

## Scripts úteis

Backend (`backend/package.json`)
- start: inicia API em modo produção
- dev: inicia API com nodemon
- db:test: testa conexão com o banco
- db:migrate / db:migrate:undo / db:reset
- db:seed / db:seed:undo

Frontend (`frontend/package.json`)
- start / android / ios / web

Raiz do repositório
- `testar-funcionalidades.sh`: script de smoke test de integrações (login, cardápio, comanda, produção, relatório)

## API — Endpoints principais

Observações
- Autenticação: Bearer JWT (exceto rotas públicas de autenticação)
- Base: `http://localhost:3333/api`

Autenticação (`/autenticacao`)
- POST `/login` — login com email/senha
- POST `/registrar` — cria usuário
- GET `/verificar` — valida token
- POST `/esqueci-minha-senha` — solicita token de recuperação
- POST `/resetar-senha` — redefine senha com token

Usuários (`/usuarios`) [protegido]
- GET `/` — listar
- GET `/:id` — buscar por id
- PUT `/:id` — atualizar
- PATCH `/:id/inativar` — inativar
- PATCH `/:id/ativar` — reativar

Cardápio (`/cardapio`) [protegido]
- GET `/` — listar itens do cardápio
- GET `/:id` — detalhe
- POST `/` — criar item
- PUT `/:id` — atualizar
- DELETE `/:id` — remover
- PATCH `/:id/ativar` — reativar/ativar

Comandas (`/comandas`) [protegido]
- GET `/` — listar comandas
- GET `/:id` — detalhes (inclui itens)
- POST `/` — abrir comanda
- POST `/:id/itens` — adicionar item
- PATCH `/:id/itens/:itemComandaId` — atualizar quantidade/observação
- DELETE `/:id/itens/:itemComandaId` — remover item
- PUT `/:id/fechar` — fechar comanda (usa regra de itens entregues)
- PUT `/:id/pagar` — registrar pagamento

Produção (`/producao`) [protegido]
- GET `/copa` — fila da Copa (bebidas)
- GET `/cozinha` — fila da Cozinha (pratos)
- PUT `/:id/iniciar` — iniciar produção
- PUT `/:id/pronto` — marcar como pronto
- PUT `/:id/entregar` — marcar como entregue
- PUT `/:id/status` — atualizar status
- GET `/estatisticas` — estatísticas de produção

Relatórios (`/relatorios`) [protegido]
- GET `/vendas-diarias?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD` — usa `relatorio_vendas_diarias`
- GET `/itens-mais-vendidos?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD&limite=10` — usa `itens_mais_vendidos`
- GET `/diario` — resumo diário simplificado (usa as funções acima)
- GET `/periodo?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD` — resumo por período

Exemplo rápido (login)

```bash
curl -X POST http://localhost:3333/api/autenticacao/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restodonte.com","senha":"admin123"}'
```

## Banco de dados — Migrações, Triggers e Stored Procedures

Entidades principais
- `usuarios` (id, nome, email, senha, ativo, token_recuperacao_senha, data_expiracao_token, criado_em, atualizado_em)
- `itens_cardapio` (id, nome, descricao, preco, tipo: PRATO|BEBIDA, ativo, tempo_preparo_minutos, criado_em, atualizado_em)
- `comandas` (id, numero_mesa, nome_cliente, status: ABERTA|FECHADA|PAGA, data_abertura, data_fechamento, valor_total, observacoes, criado_em, atualizado_em)
- `itens_comanda` (id, comanda_id, item_cardapio_id, quantidade, preco_unitario, subtotal, status_producao, observacoes, datas de produção/entrega, timestamps)

Migrações (ordem)
1. `20250106000001-create-usuarios.js`
2. `20250106000002-create-itens-cardapio.js`
3. `20250106000003-create-comandas.js`
4. `20250106000004-create-itens-comanda.js`
5. `20250106000005-create-triggers-pt.js`
6. `20250106000006-create-stored-procedures.js`
7. `20251127022959-adicionar-campos-recuperacao-senha-usuarios.js`

Triggers (arquivo: `create-triggers-pt.js`)
- `atualizar_subtotal_item` (BEFORE INSERT/UPDATE em `itens_comanda`) — mantém `subtotal = quantidade * preco_unitario`.
- `atualizar_valor_total_comanda` (AFTER INSERT/UPDATE/DELETE em `itens_comanda`) — recalcula `comandas.valor_total` somando subtotais.
- `registrar_datas_producao` (BEFORE UPDATE de `status_producao` em `itens_comanda`) — carimba início, fim e entrega conforme mudança de status.

Stored Procedures / Funções (arquivo: `create-stored-procedures.js`)
- `relatorio_vendas_diarias(data_inicio DATE, data_fim DATE)`
  - Retorna: data, total_comandas, total_vendas, total_itens_vendidos, ticket_medio.
  - Usa status de comanda em ('FECHADA', 'PAGA').
- `itens_mais_vendidos(data_inicio DATE, data_fim DATE, limite INTEGER DEFAULT 10)`
  - Retorna: item_id, item_nome, tipo, quantidade_vendida, receita_total.
- `fechar_comanda(comanda_id_param INTEGER)`
  - Valida se comanda está ABERTA e se todos itens foram ENTREGUES; fecha e retorna resumo.
- `pedidos_pendentes_por_setor(setor VARCHAR)`
  - Lista pedidos pendentes por setor ('PRATO' = Cozinha, 'BEBIDA' = Copa).

Seeders
- `20250106000001-seed-usuarios.js` — cria admin (email: `admin@restodonte.com`, senha: `admin123`) e um garçom.
- `20250106000002-seed-itens-cardapio.js` — popula itens de PRATO e BEBIDA com tempos de preparo.

## Estrutura de pastas

```
restoDonte/
  testar-funcionalidades.sh
  backend/
    .sequelizerc
    package.json
    src/
      server.js
      config/database.js
      controllers/*
      services/*
      models/*
      middlewares/*
      routes/*
      database/
        migrations/*
        seeders/*
  frontend/
    package.json
    App.js, index.js, app.json
    src/
      api/api.js
      config/ambiente.js
      components/*
      contexts/*
      navigation/*
      screens/*
      constants/*
      assets/*
```
---
