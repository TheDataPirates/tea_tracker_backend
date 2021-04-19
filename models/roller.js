const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Roller", {
    roller_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    modal:Sequelize.STRING,
    machine_purchase_date:Sequelize.DATE,
    power_info:Sequelize.STRING,
    image:Sequelize.STRING,
});
