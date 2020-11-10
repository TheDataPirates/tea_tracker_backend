const Sequelize = require("sequelize");

const sequelize = new Sequelize("tea_tracker_db", "root", "buwa199809", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
global.sequelize = sequelize;
