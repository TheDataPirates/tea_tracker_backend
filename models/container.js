const Sequelize = require("sequelize");

const sequelize = require('../database/db');

module.exports= sequelize.define('Container', {
    container_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        
    },
    type:Sequelize.STRING,
    container_deduction: Sequelize.INTEGER,
    capacity: Sequelize.INTEGER,
});
