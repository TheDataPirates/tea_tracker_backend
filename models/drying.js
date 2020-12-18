const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Drying", {
  drying_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  batch_no: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  dhool_id: Sequelize.INTEGER,

  drying_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  roll_breaking_turn: Sequelize.INTEGER,
  dhool_weight: Sequelize.DOUBLE,
  //drier_in_
  drier_out_kg: Sequelize.DOUBLE,
  drier_out_time:Sequelize.DATE,
  date: Sequelize.DATEONLY,
});
