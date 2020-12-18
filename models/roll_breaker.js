const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Roll_Breaker", {
  roll_breaker_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
});
