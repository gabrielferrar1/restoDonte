const ServicoComanda = require('../services/ServicoComanda');

class ControladorComanda {
  async listar(req, res) {
    try {
      const filtros = {
        status: req.query.status,
        numero_mesa: req.query.numero_mesa,
        data_inicio: req.query.data_inicio,
        data_fim: req.query.data_fim
      };

      const comandas = await ServicoComanda.listarTodas(filtros);

      res.json({
        sucesso: true,
        dados: comandas
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
      const comanda = await ServicoComanda.buscarPorId(id);

      res.json({
        sucesso: true,
        dados: comanda
      });
    } catch (erro) {
      res.status(404).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async abrir(req, res) {
    try {
      const comanda = await ServicoComanda.abrir(req.body);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Comanda aberta com sucesso',
        dados: comanda
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async adicionarItem(req, res) {
    try {
      const { id } = req.params;
      const item = await ServicoComanda.adicionarItem(id, req.body);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Item adicionado à comanda',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async fechar(req, res) {
    try {
      const { id } = req.params;
      const comanda = await ServicoComanda.fecharComanda(id);

      res.json({
        sucesso: true,
        mensagem: 'Comanda fechada com sucesso',
        dados: comanda
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  async registrarPagamento(req, res) {
    try {
      const { id } = req.params;
      const comanda = await ServicoComanda.registrarPagamento(id);

      res.json({
        sucesso: true,
        mensagem: 'Pagamento registrado com sucesso',
        dados: comanda
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
}

