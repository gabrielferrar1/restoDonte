# Database Seeders

Esta pasta contém os arquivos de seeders do Sequelize. Os seeders são responsáveis por popular o banco de dados com dados iniciais ou de teste.

## Como criar um seeder:

```bash
npx sequelize-cli seed:generate --name adicionar-dados-exemplo
```

## Exemplo de estrutura de um seeder:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('exemplos', [
      {
        nome: 'Exemplo 1',
        descricao: 'Descrição do exemplo 1',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Exemplo 2',
        descricao: 'Descrição do exemplo 2',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('exemplos', null, {});
  }
};
```

## Executar seeders:

```bash
# Executar todos os seeders
npx sequelize-cli db:seed:all

# Executar um seeder específico
npx sequelize-cli db:seed --seed 20240101000000-adicionar-dados-exemplo.js

# Reverter todos os seeders
npx sequelize-cli db:seed:undo:all

# Reverter o último seeder
npx sequelize-cli db:seed:undo
```

## Seeders a serem criados:

1. **adicionar-mesas-iniciais.js** - Dados iniciais de mesas
   - Exemplo: Mesa 1, Mesa 2, Mesa 3, etc.

2. **adicionar-itens-menu-iniciais.js** - Dados iniciais do cardápio
   - Exemplos: Bebidas, Pratos principais, Sobremesas

3. **adicionar-clientes-teste.js** (opcional para desenvolvimento)
   - Clientes de exemplo para testes

## Observações:

- Seeders devem ser executados **após** as migrations
- Use seeders para dados iniciais que o sistema precisa para funcionar
- Use seeders de teste apenas em ambiente de desenvolvimento
- Sempre implemente os métodos `up` e `down` para permitir reverter os dados
