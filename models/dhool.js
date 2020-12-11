const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Dhool", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  rolling_turn:Sequelize.INTEGER,
  rolling_in_kg:Sequelize.DOUBLE,
  rolling_in_time:Sequelize.DATE,
  rolling_out_kg:Sequelize.DOUBLE,
  rolling_out_time:Sequelize.DATE,
  rb_out_time: Sequelize.DATE,
  dhool_out_weight: Sequelize.DOUBLE,
  dhool_pct: Sequelize.INTEGER,
  fd_time_out: Sequelize.DATE,
  fd_out_kg: Sequelize.DOUBLE,
  fd_pct: Sequelize.INTEGER,
  drier_out_kg: Sequelize.DOUBLE,
  drier_out_time:Sequelize.DATE
  //batch_no fk
  //roller_id fk
  //roll_breaker_id fk
  //drier_id fk
});
