const { sequelize } = require('../models');

class ServicoRelatorio {

  async relatorioVendasDiarias(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }
    const [resultados] = await sequelize.query(
      'SELECT * FROM relatorio_vendas_diarias(:dataInicio, :dataFim)',
      { replacements: { dataInicio, dataFim } }
    );
    return resultados;
  }

  async itensMaisVendidos(dataInicio, dataFim, limite = 10) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }
    const [resultados] = await sequelize.query(
      'SELECT * FROM itens_mais_vendidos(:dataInicio, :dataFim, :limite)',
      { replacements: { dataInicio, dataFim, limite } }
    );
    return resultados;
  }

  async relatorioDiarioSimplificado() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataInicio = hoje.toISOString().split('T')[0];
    const dataFim = dataInicio;

    const vendas = await this.relatorioVendasDiarias(dataInicio, dataFim);
    const itensMaisVendidos = await this.itensMaisVendidos(dataInicio, dataFim, 5);

    const acumulado = vendas.reduce((acc, dia) => {
      const totalComandas = Number(dia.total_comandas || 0);
      const totalVendas = Number(dia.total_vendas || 0);
      const totalItens = Number(dia.total_itens_vendidos || 0);
      acc.total_comandas += totalComandas;
      acc.total_vendas += totalVendas;
      acc.total_itens_vendidos += totalItens;
      return acc;
    }, { total_comandas: 0, total_vendas: 0, total_itens_vendidos: 0 });

    const ticketMedio = acumulado.total_comandas > 0
      ? acumulado.total_vendas / acumulado.total_comandas
      : 0;

    return {
      data: dataInicio,
      total_vendas: Number(acumulado.total_vendas.toFixed(2)),
      comandas_fechadas: acumulado.total_comandas,
      itens_vendidos: acumulado.total_itens_vendidos,
      ticket_medio: Number(ticketMedio.toFixed(2)),
      itens_populares: itensMaisVendidos.map(i => ({
        id: i.item_id,
        nome: i.item_nome,
        tipo: i.tipo,
        quantidade: Number(i.quantidade_vendida || 0),
        receita: Number(i.receita_total || 0)
      }))
    };
  }

  async relatorioPeriodo(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }
    const vendas = await this.relatorioVendasDiarias(dataInicio, dataFim);
    const itensMaisVendidos = await this.itensMaisVendidos(dataInicio, dataFim, 20);

    const totais = vendas.reduce((acc, dia) => ({
      total_comandas: acc.total_comandas + Number(dia.total_comandas || 0),
      total_vendas: acc.total_vendas + Number(dia.total_vendas || 0),
      total_itens: acc.total_itens + Number(dia.total_itens_vendidos || 0)
    }), { total_comandas: 0, total_vendas: 0, total_itens: 0 });

    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      totais: {
        ...totais,
        ticket_medio: totais.total_comandas > 0
          ? (totais.total_vendas / totais.total_comandas).toFixed(2)
          : 0
      },
      vendas_por_dia: vendas,
      itens_mais_vendidos: itensMaisVendidos
    };
  }
}

module.exports = new ServicoRelatorio();
