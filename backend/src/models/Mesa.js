'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mesa extends Model {
    static associate(models) {
      // Associações serão definidas aqui
      // Uma mesa pode ter várias comandas
      // Mesa.hasMany(models.Comanda, { foreignKey: 'mesaId', as: 'comandas' });
    }
  }

  Mesa.init({
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'O número da mesa é obrigatório' },
        isInt: { msg: 'O número da mesa deve ser um número inteiro' },
        min: { args: [1], msg: 'O número da mesa deve ser maior que zero' }
      }
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
      validate: {
        notNull: { msg: 'A capacidade da mesa é obrigatória' },
        isInt: { msg: 'A capacidade deve ser um número inteiro' },
        min: { args: [1], msg: 'A capacidade deve ser maior que zero' }
      }
    },
    status: {
      type: DataTypes.ENUM('livre', 'ocupada', 'reservada'),
      allowNull: false,
      defaultValue: 'livre',
      validate: {
        notNull: { msg: 'O status da mesa é obrigatório' },
        isIn: {
          args: [['livre', 'ocupada', 'reservada']],
          msg: 'Status inválido. Use: livre, ocupada ou reservada'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Mesa',
    tableName: 'mesas',
    timestamps: true
  });

  return Mesa;
};
