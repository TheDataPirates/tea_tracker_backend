const Sequelize = require("sequelize");

const sequelize = require('../database/db');

const Receipt = sequelize.define('receipt', {
    receipt_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    //bulk_id fk
   total_deduction:Sequelize.DOUBLE
});

module.exports = Receipt;