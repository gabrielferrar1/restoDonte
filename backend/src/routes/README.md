# Routes

Esta pasta contém as definições de rotas da API. As rotas mapeiam URLs para controladores específicos.

## Exemplo de estrutura de rotas:

```javascript
// exemploRoutes.js
const express = require('express');
const router = express.Router();
const exemploController = require('../controllers/exemploController');

// GET /api/exemplo
router.get('/', exemploController.listar);

// GET /api/exemplo/:id
router.get('/:id', exemploController.buscarPorId);

// POST /api/exemplo
router.post('/', exemploController.criar);

// PUT /api/exemplo/:id
router.put('/:id', exemploController.atualizar);

// DELETE /api/exemplo/:id
router.delete('/:id', exemploController.deletar);

module.exports = router;
```

## Arquivo index.js para centralizar todas as rotas:

```javascript
// index.js
const express = require('express');
const router = express.Router();

const exemploRoutes = require('./exemploRoutes');

router.use('/exemplo', exemploRoutes);

module.exports = router;
```

## Rotas a serem implementadas:
- /api/mesas - Gerenciamento de mesas
- /api/clientes - Gerenciamento de clientes
- /api/menu - Gerenciamento de itens do menu
- /api/comandas - Gerenciamento de comandas
- /api/pedidos - Gerenciamento de pedidos
- /api/pagamentos - Gerenciamento de pagamentos
