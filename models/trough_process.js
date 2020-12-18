const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Trough_Process", {
  tp_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  humidity: Sequelize.DOUBLE,
  temperature: Sequelize.DOUBLE,
  date: Sequelize.DATE,
});
