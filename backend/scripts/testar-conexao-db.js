#!/usr/bin/env node
/**
 * Script para testar conexão com banco de dados PostgreSQL
 * Execute: node scripts/testar-conexao-db.js
 */
require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'restodonte',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  dialect: 'postgres',
  logging: false
};
console.log('Testando conexão com PostgreSQL...');
console.log(`Host: ${config.host}:${config.port}`);
console.log(`Database: ${config.database}`);
console.log(`User: ${config.username}`);
console.log('---');
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);
async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    // Testar query simples
    const [resultados] = await sequelize.query('SELECT version();');
    console.log(`✅ Versão do PostgreSQL: ${resultados[0].version}`);
    // Listar tabelas
    const [tabelas] = await sequelize.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `);
    if (tabelas.length > 0) {
      console.log(`✅ Tabelas encontradas (${tabelas.length}):`);
      tabelas.forEach(t => console.log(`   - ${t.tablename}`));
    } else {
      console.log('⚠️  Nenhuma tabela encontrada. Execute as migrations.');
    }
    await sequelize.close();
    process.exit(0);
  } catch (erro) {
    console.error('❌ Erro ao conectar com o banco de dados:');
    console.error(erro.message);
    process.exit(1);
  }
}
testarConexao();
