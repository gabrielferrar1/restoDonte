# RestôDonte - Backend

Este é o repositório do backend e frontend para o aplicativo **RestôDonte**, o sistema de gerenciamento de comandas para restaurantes. Este projeto foi desenvolvido para o trabalho final das disciplinas de Programação II e Banco de Dados II.

O servidor é construído com **Node.js**, **Express**, e utiliza o **Sequelize** como ORM para se comunicar com um banco de dados **PostgreSQL**.

Para o desenvolvimento do frontend, utilizaremos **React Native** e **Expo** para criar uma aplicação móvel que se conecta a este backend.

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:
*   [Node.js](https://nodejs.org/en/ ) (versão 18 ou superior recomendada)
*   [NPM](https://www.npmjs.com/ ) (gerenciador de pacotes que vem com o Node.js)
*   [PostgreSQL](https://www.postgresql.org/download/ ) (banco de dados rodando localmente)

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

**1. Clone o Repositório:**
```bash
git clone https://github.com/seu-usuario/restoDonte.git
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
*   Copie o conteúdo abaixo para dentro do arquivo `.env` e substitua os valores pelos dados do seu banco PostgreSQL, neste caso vai precisar mudar somente a senha.

```env
# Arquivo .env
# Credenciais do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=restodonte
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
