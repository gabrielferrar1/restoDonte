# Database Migrations

Esta pasta contém os arquivos de migração do Sequelize. As migrations são responsáveis por criar e modificar a estrutura do banco de dados.

## Como criar uma migration:

```bash
npx sequelize-cli migration:generate --name criar-tabela-exemplo
```

## Exemplo de estrutura de uma migration:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exemplos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('exemplos');
  }
};
```

## Executar migrations:

```bash
# Executar todas as migrations pendentes
npx sequelize-cli db:migrate

# Reverter a última migration
npx sequelize-cli db:migrate:undo

# Reverter todas as migrations
npx sequelize-cli db:migrate:undo:all
```

## Migrations a serem criadas:

1. **create-mesas.js** - Tabela de mesas do restaurante
   - id, numero, capacidade, status (livre/ocupada), createdAt, updatedAt

2. **create-clientes.js** - Tabela de clientes
   - id, nome, telefone, email, cpf, createdAt, updatedAt

3. **create-itens-menu.js** - Tabela de itens do menu
   - id, nome, descricao, categoria, preco, disponivel, createdAt, updatedAt

4. **create-comandas.js** - Tabela de comandas
   - id, mesaId, clienteId, status (aberta/fechada), dataAbertura, dataFechamento, total, createdAt, updatedAt

5. **create-pedidos.js** - Tabela de pedidos
   - id, comandaId, itemMenuId, quantidade, precoUnitario, subtotal, observacoes, createdAt, updatedAt

6. **create-pagamentos.js** - Tabela de pagamentos
   - id, comandaId, formaPagamento, valor, dataPagamento, createdAt, updatedAt
