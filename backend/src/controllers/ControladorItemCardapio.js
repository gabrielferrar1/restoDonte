const ServicoItemCardapio = require('../services/ServicoItemCardapio');

class ControladorItemCardapio {
  async listar(req, res) {
    try {
      const filtros = {
        tipo: req.query.tipo,
        ativo: req.query.ativo !== 'false',
        nome: req.query.nome
      };

      const itens = await ServicoItemCardapio.listarTodos(filtros);

      res.json({
        sucesso: true,
        dados: itens
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const item = await ServicoItemCardapio.buscarPorId(id);

      res.json({
        sucesso: true,
        dados: item
      });
    } catch (erro) {
      res.status(404).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async criar(req, res) {
    try {
      const item = await ServicoItemCardapio.criar(req.body);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Item criado com sucesso',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const item = await ServicoItemCardapio.atualizar(id, req.body);

      res.json({
        sucesso: true,
        mensagem: 'Item atualizado com sucesso',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ServicoItemCardapio.deletar(id);

      res.json({
        sucesso: true,
        mensagem: resultado.mensagem
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async ativar(req, res) {
    try {
      const { id } = req.params;
      const item = await ServicoItemCardapio.ativar(id);

      res.json({
        sucesso: true,
        mensagem: 'Item ativado com sucesso',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
}

module.exports = new ControladorItemCardapio();

