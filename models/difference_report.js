const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Difference_Report", {
    report_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },

    //bulk_id fk
});