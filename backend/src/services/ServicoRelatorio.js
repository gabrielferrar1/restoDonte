const { sequelize } = require('../models');

class ServicoRelatorio {

  async relatorioVendasDiarias(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    const [resultados] = await sequelize.query(
      'SELECT * FROM relatorio_vendas_diarias(:dataInicio, :dataFim)',
      {
        replacements: { dataInicio, dataFim }
      }
    );

    return resultados;
  }


  async itensMaisVendidos(dataInicio, dataFim, limite = 10) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    const [resultados] = await sequelize.query(
      'SELECT * FROM itens_mais_vendidos(:dataInicio, :dataFim, :limite)',
      {
        replacements: { dataInicio, dataFim, limite }
      }
    );

    return resultados;
  }


  async relatorioDiarioSimplificado() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);


    const dataInicio = hoje.toISOString().split('T')[0];
    const dataFim = hoje.toISOString().split('T')[0];

    const vendas = await this.relatorioVendasDiarias(dataInicio, dataFim);
    const itensMaisVendidos = await this.itensMaisVendidos(dataInicio, dataFim, 5);

    return {
      data: dataInicio,
      resumo: vendas[0] || {
        data: dataInicio,
        total_comandas: 0,
        total_vendas: 0,
        total_itens_vendidos: 0,
        ticket_medio: 0
      },
      itens_mais_vendidos: itensMaisVendidos
    };
  }

  async relatorioPeriodo(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    const vendas = await this.relatorioVendasDiarias(dataInicio, dataFim);
    const itensMaisVendidos = await this.itensMaisVendidos(dataInicio, dataFim, 20);

    const totais = vendas.reduce((acc, dia) => ({
      total_comandas: acc.total_comandas + parseInt(dia.total_comandas || 0),
      total_vendas: acc.total_vendas + parseFloat(dia.total_vendas || 0),
      total_itens: acc.total_itens + parseInt(dia.total_itens_vendidos || 0)
    }), { total_comandas: 0, total_vendas: 0, total_itens: 0 });

    return {
      periodo: {
        inicio: dataInicio,
        fim: dataFim
      },
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
