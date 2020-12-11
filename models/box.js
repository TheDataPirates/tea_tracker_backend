const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Box", {
  box_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
});