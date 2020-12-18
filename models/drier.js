const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Drier", {
  drier_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
});
