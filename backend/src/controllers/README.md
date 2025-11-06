# Controllers

Esta pasta contém os controladores da aplicação. Os controladores são responsáveis por:

- Receber requisições HTTP
- Validar dados de entrada
- Chamar os serviços apropriados
- Retornar respostas HTTP formatadas

## Exemplo de estrutura de um controller:

```javascript
// exemploController.js
const exemploService = require('../services/exemploService');

const exemploController = {
    // GET /api/exemplo
    listar: async (req, res) => {
        try {
            const dados = await exemploService.listar();
            res.json(dados);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // POST /api/exemplo
    criar: async (req, res) => {
        try {
            const novoDado = await exemploService.criar(req.body);
            res.status(201).json(novoDado);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = exemploController;
```

## Controllers a serem implementados:
- Mesa (tablesController.js)
- Cliente (customersController.js)
- Item do Menu (menuItemsController.js)
- Comanda (tabsController.js)
- Pedido (ordersController.js)
- Pagamento (paymentsController.js)
