const Sequelize = require("sequelize");

const sequelize = require('../database/db');

const Bulk = sequelize.define('bulk', {
    bulk_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        
    },
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey:true
    },
    date: Sequelize.DATE,
    supplier_id: Sequelize.STRING,
    method:Sequelize.STRING
});

module.exports = Bulk;