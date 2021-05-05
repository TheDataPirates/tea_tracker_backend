const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Trough", {
  trough_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: Sequelize.STRING,
  capacity: Sequelize.INTEGER,
  image:Sequelize.STRING,
});
