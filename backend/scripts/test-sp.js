const { sequelize } = require('../src/models');

async function testar() {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const [resultados] = await sequelize.query('SELECT * FROM relatorio_vendas_diarias(:inicio, :fim)', {
      replacements: { inicio: hoje, fim: hoje },
    });
    console.log('OK - relatorio_vendas_diarias retornou', resultados.length, 'linhas');
  } catch (err) {
    console.error('ERRO', err.message);
  } finally {
    await sequelize.close();
  }
}

testar();

