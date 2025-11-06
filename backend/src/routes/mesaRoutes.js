const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');

// GET /api/mesas - Lista todas as mesas
router.get('/', mesaController.listar);

// GET /api/mesas/:id - Busca uma mesa por ID
router.get('/:id', mesaController.buscarPorId);

// POST /api/mesas - Cria uma nova mesa
router.post('/', mesaController.criar);

// PUT /api/mesas/:id - Atualiza uma mesa
router.put('/:id', mesaController.atualizar);

// PATCH /api/mesas/:id/status - Altera o status de uma mesa
router.patch('/:id/status', mesaController.alterarStatus);

// DELETE /api/mesas/:id - Deleta uma mesa
router.delete('/:id', mesaController.deletar);

module.exports = router;
