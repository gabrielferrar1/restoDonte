'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const senhaHash = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('usuarios', [
      {
        nome: 'Administrador',
        email: 'admin@restodonte.com',
        senha: senhaHash,
        ativo: true,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Garçom 1',
        email: 'garcom1@restodonte.com',
        senha: senhaHash,
        ativo: true,
        criado_em: new Date(),
        atualizado_em: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};

