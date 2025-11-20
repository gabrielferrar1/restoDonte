const express = require('express');
const roteador = express.Router();
const ControladorComanda = require('../controllers/ControladorComanda');
const middlewareAutenticacao = require('../middlewares/middlewareAutenticacao');

// Todas as rotas requerem autenticação
roteador.use(middlewareAutenticacao);

roteador.get('/', ControladorComanda.listar);
roteador.get('/:id', ControladorComanda.buscarPorId);
roteador.post('/', ControladorComanda.abrir);
roteador.post('/:id/itens', ControladorComanda.adicionarItem);
roteador.put('/:id/fechar', ControladorComanda.fechar);
roteador.put('/:id/pagar', ControladorComanda.registrarPagamento);

module.exports = roteador;

