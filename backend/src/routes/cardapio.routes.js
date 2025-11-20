const express = require('express');
const roteador = express.Router();
const ControladorItemCardapio = require('../controllers/ControladorItemCardapio');
const middlewareAutenticacao = require('../middlewares/middlewareAutenticacao');

// Todas as rotas requerem autenticação
roteador.use(middlewareAutenticacao);

roteador.get('/', ControladorItemCardapio.listar);
roteador.get('/:id', ControladorItemCardapio.buscarPorId);
roteador.post('/', ControladorItemCardapio.criar);
roteador.put('/:id', ControladorItemCardapio.atualizar);
roteador.delete('/:id', ControladorItemCardapio.deletar);
roteador.patch('/:id/ativar', ControladorItemCardapio.ativar);

module.exports = roteador;

