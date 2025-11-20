'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comandas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      numero_mesa: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nome_cliente: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('ABERTA', 'FECHADA', 'PAGA'),
        allowNull: false,
        defaultValue: 'ABERTA'
      },
      data_abertura: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      data_fechamento: {
        type: Sequelize.DATE,
        allowNull: true
      },
      valor_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Calculado automaticamente pela trigger'
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adicionar índices para melhor performance
    await queryInterface.addIndex('comandas', ['status']);
    await queryInterface.addIndex('comandas', ['data_abertura']);
    await queryInterface.addIndex('comandas', ['numero_mesa']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comandas');
  }
};

