const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Dhool", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  batch_date: Sequelize.DATE,
  drier_id: Sequelize.INTEGER,
  rb_id:Sequelize.STRING,
  batch_no:Sequelize.INTEGER,
  rb_turn: Sequelize.STRING,
  rb_out_time: Sequelize.DATE,
  dhool_out_weight: Sequelize.DOUBLE,
  dhool_pct: Sequelize.INTEGER,
  fd_time_out: Sequelize.DATE,
  fd_out_kg: Sequelize.DOUBLE,
  fd_pct: Sequelize.INTEGER,
  drier_out_kg: Sequelize.DOUBLE,
  drier_out_time:Sequelize.DATE
});
