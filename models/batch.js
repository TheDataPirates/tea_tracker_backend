const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Batch", {
  batch_no: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  batch_date: {
    type: Sequelize.DATEONLY,
    primaryKey: true,
  },
  weight:Sequelize.DOUBLE,
  outturn:Sequelize.DOUBLE
});
