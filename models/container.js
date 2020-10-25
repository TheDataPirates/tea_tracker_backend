const Sequelize = require("sequelize");

const sequelize = require('../database/db');

const Container = sequelize.define('container', {
    container_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        
    },
    type:Sequelize.STRING,
    container_deduction: Sequelize.INTEGER,
    capacity: Sequelize.INTEGER,
});

module.exports = Container;