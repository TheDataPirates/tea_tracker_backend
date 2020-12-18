const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Batch", {
  batch_no: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  batch_date: {
    type: Sequelize.DATE,
    primaryKey: true,
  },
});
