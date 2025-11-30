'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'token_recuperacao_senha', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Token temporário para recuperação de senha'
    });

    await queryInterface.addColumn('usuarios', 'data_expiracao_token', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Data e hora de expiração do token de recuperação de senha'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('usuarios', 'token_recuperacao_senha');
    await queryInterface.removeColumn('usuarios', 'data_expiracao_token');
  }
};
