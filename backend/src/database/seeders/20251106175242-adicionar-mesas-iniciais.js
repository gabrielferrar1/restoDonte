'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const mesas = [];
    const now = new Date();
    
    // Cria 10 mesas com capacidades variadas
    for (let i = 1; i <= 10; i++) {
      mesas.push({
        numero: i,
        capacidade: i <= 3 ? 2 : i <= 7 ? 4 : 6, // Mesas 1-3: 2 lugares, 4-7: 4 lugares, 8-10: 6 lugares
        status: 'livre',
        createdAt: now,
        updatedAt: now
      });
    }
    
    await queryInterface.bulkInsert('mesas', mesas, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mesas', null, {});
  }
};
