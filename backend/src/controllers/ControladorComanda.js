const ServicoComanda = require('../services/ServicoComanda');

// Abstração para tratamento de erros e respostas
const lidarComErros = (res, erro) => {
  console.error(erro); // Log do erro para depuração
  const status = erro.message.includes('não encontrada') ? 404 : 400;
  res.status(status).json({ sucesso: false, erro: erro.message });
};

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
      res.status(200).json(comandas);
    } catch (erro) {
      // Erros de listagem são mais genéricos, podem ser 500
      console.error(erro);
      res.status(500).json({ sucesso: false, erro: 'Ocorreu um erro ao listar as comandas.' });
    }
  }

  async buscarPorId(req, res) {
    try {
      const comanda = await ServicoComanda.buscarPorId(req.params.id);
      res.status(200).json(comanda);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async abrir(req, res) {
    try {
      const comanda = await ServicoComanda.abrir(req.body);
      res.status(201).json(comanda);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async adicionarItem(req, res) {
    try {
      const item = await ServicoComanda.adicionarItem(req.params.id, req.body);
      res.status(201).json(item);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async removerItem(req, res) {
    try {
      const { id, itemComandaId } = req.params;
      const resultado = await ServicoComanda.removerItem(id, itemComandaId);
      res.status(200).json(resultado);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async atualizarQuantidadeItem(req, res) {
    try {
      const { id, itemComandaId } = req.params;
      const { quantidade } = req.body;
      const resultado = await ServicoComanda.atualizarQuantidadeItem(id, itemComandaId, quantidade);
      res.status(200).json(resultado);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async fechar(req, res) {
    try {
      const comanda = await ServicoComanda.fecharComanda(req.params.id);
      res.status(200).json(comanda);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }

  async registrarPagamento(req, res) {
    try {
      const comanda = await ServicoComanda.registrarPagamento(req.params.id);
      res.status(200).json(comanda);
    } catch (erro) {
      lidarComErros(res, erro);
    }
  }
}

module.exports = new ControladorComanda();
