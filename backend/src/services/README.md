# Services

Esta pasta contém a camada de serviços da aplicação. Os serviços implementam a lógica de negócio e:

- Aplicam regras de negócio
- Interagem com os models/banco de dados
- Realizam validações complexas
- Encapsulam operações que envolvem múltiplos models

## Exemplo de estrutura de um service:

```javascript
// exemploService.js
const { Exemplo } = require('../models');

const exemploService = {
    listar: async () => {
        return await Exemplo.findAll();
    },
    
    buscarPorId: async (id) => {
        const item = await Exemplo.findByPk(id);
        if (!item) {
            throw new Error('Item não encontrado');
        }
        return item;
    },
    
    criar: async (dados) => {
        // Validações de negócio
        if (!dados.nome || dados.nome.length < 3) {
            throw new Error('Nome deve ter no mínimo 3 caracteres');
        }
        
        return await Exemplo.create(dados);
    },
    
    atualizar: async (id, dados) => {
        const item = await exemploService.buscarPorId(id);
        return await item.update(dados);
    },
    
    deletar: async (id) => {
        const item = await exemploService.buscarPorId(id);
        await item.destroy();
        return { message: 'Item deletado com sucesso' };
    }
};

module.exports = exemploService;
```

## Services a serem implementados:
- mesaService.js - Lógica de gerenciamento de mesas
- clienteService.js - Lógica de gerenciamento de clientes
- menuService.js - Lógica de gerenciamento de itens do menu
- comandaService.js - Lógica de gerenciamento de comandas (inclui cálculos de totais)
- pedidoService.js - Lógica de gerenciamento de pedidos
- pagamentoService.js - Lógica de processamento de pagamentos
