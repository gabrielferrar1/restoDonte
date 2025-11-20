const express = require('express');
const roteador = express.Router();
const ControladorRelatorio = require('../controllers/ControladorRelatorio');
const middlewareAutenticacao = require('../middlewares/middlewareAutenticacao');

// Todas as rotas requerem autenticação
roteador.use(middlewareAutenticacao);

roteador.get('/vendas-diarias', ControladorRelatorio.relatorioVendasDiarias);
roteador.get('/itens-mais-vendidos', ControladorRelatorio.itensMaisVendidos);
roteador.get('/diario', ControladorRelatorio.relatorioDiario);
roteador.get('/periodo', ControladorRelatorio.relatorioPeriodo);

module.exports = roteador;

