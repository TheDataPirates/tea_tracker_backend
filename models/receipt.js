const Sequelize = require("sequelize");

const sequelize = require('../database/db');

const Receipt = sequelize.define('receipt', {
    receipt_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
   total_deduction:Sequelize.INTEGER
});

module.exports = Receipt;