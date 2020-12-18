const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Roll_Break", {
  roll_break_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  batch_no: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  dhool_id: Sequelize.INTEGER,

  roll_breaker_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  roll_breaking_turn: Sequelize.INTEGER,
  dhool_weight: Sequelize.DOUBLE,
  dhool_pct: Sequelize.INTEGER,
  date: Sequelize.DATEONLY,
});
