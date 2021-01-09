const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Difference_Report", {
    report_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    original_weight: Sequelize.DOUBLE,
    remeasuring_weight: Sequelize.DOUBLE,
    weight_difference: Sequelize.DOUBLE,
    supplier_id: Sequelize.STRING,
    //bulk_id fk
});