const express = require('express');
const roteador = express.Router();
const ControladorUsuario = require('../controllers/ControladorUsuario');
const middlewareAutenticacao = require('../middlewares/middlewareAutenticacao');

roteador.use(middlewareAutenticacao);

roteador.get('/', ControladorUsuario.listar);
roteador.get('/:id', ControladorUsuario.buscarPorId);
roteador.put('/:id', ControladorUsuario.atualizar);
roteador.patch('/:id/inativar', ControladorUsuario.inativar);
roteador.patch('/:id/ativar', ControladorUsuario.ativar);

module.exports = roteador;

