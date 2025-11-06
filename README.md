# RestôDonte - Backend e Frontend

Este é o repositório do backend e frontend para o aplicativo **RestôDonte**, o sistema de gerenciamento de comandas para restaurantes. Este projeto foi desenvolvido para o trabalho final das disciplinas de Programação II e Banco de Dados II.

O servidor é construído com **Node.js**, **Express**, e utiliza o **Sequelize** como ORM para se comunicar com um banco de dados **PostgreSQL**.

Para o desenvolvimento do frontend, utilizaremos **React Native** e **Expo** para criar uma aplicação móvel que se conecta a este backend.

## 📚 Documentação

- **[Guia de Implementação](backend/GUIA_IMPLEMENTACAO.md)** - Tutorial completo sobre o que foi implementado e próximos passos
- **[Documentação da API](backend/API_DOCS.md)** - Referência completa de todos os endpoints da API

## ✅ Status do Projeto

### Implementado
- ✅ Servidor Express configurado
- ✅ Conexão com PostgreSQL via Sequelize
- ✅ Estrutura de pastas completa (models, controllers, services, routes)
- ✅ Sistema de migrations e seeders
- ✅ Módulo completo de Mesas (CRUD)
  - Model com validações
  - Service com regras de negócio
  - Controller com endpoints REST
  - Migration e Seeder

### Em Desenvolvimento
- 🚧 Módulo de Clientes
- 🚧 Módulo de Itens do Menu
- 🚧 Módulo de Comandas
- 🚧 Módulo de Pedidos
- 🚧 Módulo de Pagamentos
- 🚧 Frontend React Native

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:
*   [Node.js](https://nodejs.org/en/ ) (versão 18 ou superior recomendada)
*   [NPM](https://www.npmjs.com/ ) (gerenciador de pacotes que vem com o Node.js)
*   [PostgreSQL](https://www.postgresql.org/download/ ) (banco de dados rodando localmente)

## 🚀 Início Rápido

### 1. Clone o Repositório
```bash
git clone https://github.com/gabrielferrar1/restoDonte.git
cd restoDonte/backend
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Copie o arquivo de exemplo e configure suas credenciais:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com as credenciais do seu PostgreSQL:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=restodonte
DB_SSL=false
```

### 4. Crie o Banco de Dados
```bash
createdb restodonte
```

Ou via SQL:
```sql
CREATE DATABASE restodonte;
```

### 5. Execute as Migrations
```bash
npx sequelize-cli db:migrate
```

### 6. (Opcional) Popule com Dados Iniciais
```bash
npx sequelize-cli db:seed:all
```

### 7. Inicie o Servidor
```bash
npm run dev
```

O servidor estará rodando em: http://localhost:3000

## 📝 Testando a API

### Health Check
```bash
curl http://localhost:3000/health
```

### Listar Mesas
```bash
curl http://localhost:3000/api/mesas
```

### Criar uma Mesa
```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -d '{"numero": 11, "capacidade": 4}'
```

Para mais exemplos, consulte a [Documentação da API](backend/API_DOCS.md).

## Instalação e Execução (Detalhada)

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

**1. Clone o Repositório:**
```bash
git clone https://github.com/gabrielferrar1/restoDonte.git
cd restoDonte/backend
```

**2. Instale as Dependências:**
Este comando irá baixar todas as bibliotecas necessárias para o projeto.
```bash
npm install
```

**3. Configure as Variáveis de Ambiente:**
O projeto precisa de um arquivo `.env` para armazenar as credenciais do banco de dados.

*   Na pasta `backend`, crie um arquivo chamado `.env`.
*   Copie o arquivo `.env.example` ou adicione o conteúdo abaixo e substitua os valores pelos dados do seu banco PostgreSQL:

```env
# Arquivo .env
# Configuração do Servidor
PORT=3000
NODE_ENV=development

# Credenciais do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=restodonte
DB_SSL=false
```

**4. Crie o Banco de Dados:**
Certifique-se de que o banco de dados definido em `DB_NAME` (por exemplo, `restodonte` ) exista no seu servidor PostgreSQL. Você pode criá-lo usando uma ferramenta como DBeaver, pgAdmin ou via linha de comando.

**5. Execute as Migrations:**
As migrations são responsáveis por criar a estrutura de tabelas no seu banco de dados.
```bash
npx sequelize-cli db:migrate
```

**6. Execute o Servidor:**
Para iniciar o servidor em modo de desenvolvimento (que reinicia automaticamente a cada alteração no código), use:
```bash
npm run dev
```

## Scripts Disponíveis no Projeto

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com `nodemon`.
- `npm start`: Inicia o servidor em modo de produção.
- `npx sequelize-cli db:migrate`: Aplica todas as migrations pendentes no banco de dados.
- `npx sequelize-cli db:seed:all`: Popula o banco com dados de teste (definidos nos arquivos de *seeders* ).

## Estrutura do Projeto

```
src/
├── config/         # Arquivos de configuração (banco de dados, etc.)
├── controllers/    # Controladores (lógica de requisição e resposta HTTP)
├── database/       # Migrations e Seeders do Sequelize
├── models/         # Modelos do Sequelize (representação das tabelas)
├── routes/         # Definição das rotas da API
|── seeders/        # dados iniciais para popular o banco
└── services/       # Camada de serviço (regras de negócio)

```

## Orientações para contribuição com o projeto
Para manter o projeto organizado e garantir a qualidade do código, seguimos um fluxo de trabalho com branches. Ninguém deve enviar código diretamente para a branch `main`.

Siga este passo a passo para cada nova funcionalidade ou correção:

**1. Sincronize sua Branch `main` Local**

Antes de começar a trabalhar, garanta que sua `main` local está atualizada com a versão mais recente do repositório remoto.

```bash
git checkout main
git pull origin main
```

**2. Crie uma Nova Branch para sua Tarefa**

Crie uma branch a partir da `main` para isolar seu trabalho. Use prefixos como `feature/`, `fix/` ou `docs/` para identificar o tipo de tarefa.

*   **Para uma nova funcionalidade:**
    ```bash
    git checkout -b feature/nome-da-funcionalidade
    ```
    *Exemplo:* `git checkout -b feature/autenticacao-jwt`

*   **Para uma correção de bug:**
    ```bash
    git checkout -b fix/descricao-do-bug
    ```
    *Exemplo:* `git checkout -b fix/erro-calculo-total-comanda`

**3. Trabalhe e Faça Commits na sua Branch**

Faça seu trabalho normalmente. Adicione e "commite" suas alterações em pequenos passos lógicos. Escreva mensagens de commit claras.

```bash
# Após fazer suas alterações...
git add .

# Use mensagens de commit descritivas
git commit -m "feat: adiciona rota POST para criar usuários"
```

**4. Envie sua Branch para o GitHub**

Quando seu trabalho estiver concluído, envie sua branch para o repositório remoto no GitHub.

```bash
git push origin nome-da-sua-branch
```
*Exemplo:* `git push origin feature/autenticacao-jwt`

**5. Abra um Pull Request (PR)**

*   Acesse a página do nosso repositório no GitHub.
*   O GitHub mostrará um aviso com um botão "Compare & pull request". Clique nele.
*   Escreva um título claro e uma breve descrição do que você fez.
*   Na seção "Reviewers" (Revisores) à direita, selecione pelo menos um colega de equipe para revisar seu código.
*   Clique em "Create pull request".

**6. Avivar no Grupo do Whats**

Após abrir o PR, avise no grupo do WhatsApp da equipe que você criou um novo PR para revisão. Isso ajuda a garantir que alguém veja e avalie o código.
