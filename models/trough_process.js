const Sequelize = require("sequelize");
const sequelize = require("../database/db");
const Trough = require("./trough");
const Process = require("./process");

module.exports = sequelize.define("Trough_Process", {
  tp_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  humidity: Sequelize.DOUBLE,
  temperature: Sequelize.DOUBLE,
  date: Sequelize.DATE,
  TroughTroughId:{
    type: Sequelize.INTEGER,
    references:{
      modal:Trough,
      key:"trough_id"
    }
  },
  ProcessProcessName:{
    type:Sequelize.STRING,
    references:{
      modal: Process,
      key:"process_name"
    }
  }
});
