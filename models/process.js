const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Process", {
  process_name: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
});