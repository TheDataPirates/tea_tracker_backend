const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Roller", {
    roller_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    model_no:{
        type:Sequelize.STRING,
    }
});
