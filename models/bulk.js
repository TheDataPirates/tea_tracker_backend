const Sequelize = require("sequelize");

const sequelize = require('../database/db');

module.exports = sequelize.define('Bulk', {
    bulk_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        
    },
    date: Sequelize.DATEONLY,
   
    method:Sequelize.STRING
});
