const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Box", {
  box_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  trough_id: {
    type: Sequelize.DATE,
    primaryKey: true,
  },
});