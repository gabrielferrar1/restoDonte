const express = require('express');
const roteador = express.Router();

// Importar todas as rotas
const rotasAutenticacao = require('./autenticacao.routes');
const rotasCardapio = require('./cardapio.routes');
const rotasComanda = require('./comanda.routes');
const rotasProducao = require('./producao.routes');
const rotasRelatorio = require('./relatorio.routes');

// Rota de status da API
roteador.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API RestôDonte está rodando!',
    versao: '1.0.0',
    endpoints: {
      autenticacao: '/api/autenticacao',
      cardapio: '/api/cardapio',
      comandas: '/api/comandas',
      producao: '/api/producao',
      relatorios: '/api/relatorios'
    }
  });
});

// Registrar rotas
roteador.use('/autenticacao', rotasAutenticacao);
roteador.use('/cardapio', rotasCardapio);
roteador.use('/comandas', rotasComanda);
roteador.use('/producao', rotasProducao);
roteador.use('/relatorios', rotasRelatorio);

module.exports = roteador;
const ServicoAutenticacao = require('../services/ServicoAutenticacao');

const middlewareAutenticacao = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token não fornecido. Acesso não autorizado.'
      });
    }

    const decodificado = ServicoAutenticacao.verificarToken(token);
    req.usuario = decodificado;

    next();
  } catch (erro) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado'
    });
  }
};

module.exports = middlewareAutenticacao;

