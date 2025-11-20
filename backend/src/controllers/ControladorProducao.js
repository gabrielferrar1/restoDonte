const ServicoProducao = require('../services/ServicoProducao');

class ControladorProducao {
  /**
   * GET /producao/copa - Listar pedidos da Copa (BEBIDA)
   */
  async listarPedidosCopa(req, res) {
    try {
      const pedidos = await ServicoProducao.listarPedidosPorSetor('BEBIDA');

      res.json({
        sucesso: true,
        setor: 'COPA',
        dados: pedidos
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  /**
   * GET /producao/cozinha - Listar pedidos da Cozinha (PRATO)
   */
  async listarPedidosCozinha(req, res) {
    try {
      const pedidos = await ServicoProducao.listarPedidosPorSetor('PRATO');

      res.json({
        sucesso: true,
        setor: 'COZINHA',
        dados: pedidos
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  /**
   * PUT /producao/:id/iniciar - Iniciar produção
   */
  async iniciarProducao(req, res) {
    try {
      const { id } = req.params;
      const item = await ServicoProducao.iniciarProducao(id);

      res.json({
        sucesso: true,
        mensagem: 'Produção iniciada',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  /**
   * PUT /producao/:id/pronto - Marcar como pronto
   */
  async marcarComoPronto(req, res) {
    try {
      const { id } = req.params;
      const item = await ServicoProducao.marcarComoPronto(id);

      res.json({
        sucesso: true,
        mensagem: 'Item marcado como pronto',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  /**
   * PUT /producao/:id/entregar - Marcar como entregue
   */
  async marcarComoEntregue(req, res) {
    try {
      const { id } = req.params;
      const item = await ServicoProducao.marcarComoEntregue(id);

      res.json({
        sucesso: true,
        mensagem: 'Item marcado como entregue',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  /**
   * PUT /producao/:id/status - Atualizar status diretamente
   */
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const item = await ServicoProducao.atualizarStatus(id, status);

      res.json({
        sucesso: true,
        mensagem: 'Status atualizado',
        dados: item
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }

  /**
   * GET /producao/estatisticas - Obter estatísticas
   */
  async obterEstatisticas(req, res) {
    try {
      const { setor } = req.query;
      const estatisticas = await ServicoProducao.obterEstatisticas(setor);

      res.json({
        sucesso: true,
        dados: estatisticas
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
}

module.exports = new ControladorProducao();

