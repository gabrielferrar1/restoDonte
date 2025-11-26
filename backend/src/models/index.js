'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Carregar modelos explicitamente para evitar divergências de filesystem
const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const ItemCardapio = require('./ItemCardapio')(sequelize, Sequelize.DataTypes);
const Comanda = require('./Comanda')(sequelize, Sequelize.DataTypes);
const ItemComanda = require('./ItemComanda')(sequelize, Sequelize.DataTypes);

db.Usuario = Usuario;
db.ItemCardapio = ItemCardapio;
db.Comanda = Comanda;
db.ItemComanda = ItemComanda;

[Usuario, ItemCardapio, Comanda, ItemComanda].forEach(modelo => {
  if (modelo.associate) {
    modelo.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
