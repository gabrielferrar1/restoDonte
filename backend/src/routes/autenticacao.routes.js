const express = require('express');
const roteador = express.Router();
const ControladorAutenticacao = require('../controllers/ControladorAutenticacao');

// Rotas públicas
roteador.post('/login', ControladorAutenticacao.login);
roteador.post('/registrar', ControladorAutenticacao.registrar);
roteador.get('/verificar', ControladorAutenticacao.verificarToken);

// Recuperação de senha
roteador.post('/esqueci-minha-senha', ControladorAutenticacao.solicitarRecuperacaoSenha);
roteador.post('/resetar-senha', ControladorAutenticacao.resetarSenha);

module.exports = roteador;
