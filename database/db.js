const Sequelize = require("sequelize");

const sequelize = new Sequelize("tea_tracker_db", "root", "devin123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
global.sequelize = sequelize;
