const express = require('express');
const roteador = express.Router();
const ControladorProducao = require('../controllers/ControladorProducao');
const middlewareAutenticacao = require('../middlewares/middlewareAutenticacao');

// Todas as rotas requerem autenticação
roteador.use(middlewareAutenticacao);

// Telas específicas para Copa e Cozinha
roteador.get('/copa', ControladorProducao.listarPedidosCopa);
roteador.get('/cozinha', ControladorProducao.listarPedidosCozinha);

// Ações de produção
roteador.put('/:id/iniciar', ControladorProducao.iniciarProducao);
roteador.put('/:id/pronto', ControladorProducao.marcarComoPronto);
roteador.put('/:id/entregar', ControladorProducao.marcarComoEntregue);
roteador.put('/:id/status', ControladorProducao.atualizarStatus);

// Estatísticas
roteador.get('/estatisticas', ControladorProducao.obterEstatisticas);

module.exports = roteador;

