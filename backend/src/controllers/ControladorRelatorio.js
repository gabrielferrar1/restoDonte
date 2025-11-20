const ServicoRelatorio = require('../services/ServicoRelatorio');
class ControladorRelatorio {
  async relatorioVendasDiarias(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;
      const relatorio = await ServicoRelatorio.relatorioVendasDiarias(
        data_inicio,
        data_fim
      );
      res.json({
        sucesso: true,
        dados: relatorio
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
  async itensMaisVendidos(req, res) {
    try {
      const { data_inicio, data_fim, limite } = req.query;
      const relatorio = await ServicoRelatorio.itensMaisVendidos(
        data_inicio,
        data_fim,
        limite ? parseInt(limite) : 10
      );
      res.json({
        sucesso: true,
        dados: relatorio
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
  async relatorioDiario(req, res) {
    try {
      const relatorio = await ServicoRelatorio.relatorioDiarioSimplificado();
      res.json({
        sucesso: true,
        dados: relatorio
      });
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
  async relatorioPeriodo(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;
      const relatorio = await ServicoRelatorio.relatorioPeriodo(
        data_inicio,
        data_fim
      );
      res.json({
        sucesso: true,
        dados: relatorio
      });
    } catch (erro) {
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
}
module.exports = new ControladorRelatorio();
