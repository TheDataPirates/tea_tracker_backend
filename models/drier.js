const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Drier", {
    drier_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    modal:Sequelize.STRING,
    machine_purchase_date:Sequelize.DATEONLY,
    power_info:Sequelize.STRING,
    image:Sequelize.STRING,

});