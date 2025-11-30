const ServicoUsuario = require('../services/ServicoUsuario');

// Abstração para tratamento de erros e respostas
const lidarComErros = (res, erro) => {
  console.error(erro); // Log do erro para depuração
  const status = erro.message.includes('não encontrado') ? 404 : 400;
  res.status(status).json({ sucesso: false, erro: erro.message });
};

class ControladorUsuario {
  async listar(req, res) {
    try {
      const usuarios = await ServicoUsuario.listarTodos(req.query);
      res.status(200).json(usuarios);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async buscarPorId(req, res) {
    try {
      const usuario = await ServicoUsuario.buscarPorId(req.params.id);
      res.status(200).json(usuario);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async atualizar(req, res) {
    try {
      const usuarioAtualizado = await ServicoUsuario.atualizar(req.params.id, req.body);
      res.status(200).json(usuarioAtualizado);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async inativar(req, res) {
    try {
      const resultado = await ServicoUsuario.inativar(req.params.id);
      res.status(200).json(resultado);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async ativar(req, res) {
    try {
      const resultado = await ServicoUsuario.ativar(req.params.id);
      res.status(200).json(resultado);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }
}

module.exports = new ControladorUsuario();

