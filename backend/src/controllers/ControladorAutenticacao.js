const ServicoAutenticacao = require('../services/ServicoAutenticacao');

class ControladorAutenticacao {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const resultado = await ServicoAutenticacao.login(email, senha);

      res.json({
        sucesso: true,
        dados: resultado
      });
    } catch (erro) {
      res.status(401).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async registrar(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const usuario = await ServicoAutenticacao.registrar(nome, email, senha);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário criado com sucesso',
        dados: usuario
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async verificarToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Token não fornecido'
        });
      }

      const decodificado = ServicoAutenticacao.verificarToken(token);

      res.json({
        sucesso: true,
        dados: decodificado
      });
    } catch (erro) {
      res.status(401).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
}

module.exports = new ControladorAutenticacao();

