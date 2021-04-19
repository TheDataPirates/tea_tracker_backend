const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Box", {
  box_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  date: {
    type: Sequelize.DATEONLY,
    primaryKey: true,
  },
  loading_time:Sequelize.TIME,
  unloading_time:Sequelize.TIME,
  loading_weight:Sequelize.DOUBLE,
  withered_pct:Sequelize.DOUBLE,
  unloading_weight:Sequelize.DOUBLE,
  // date: Sequelize.DATEONLY,
  //trough_id fk
  //batch_id fk
});