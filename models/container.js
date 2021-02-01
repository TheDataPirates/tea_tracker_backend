const Sequelize = require("sequelize");

const sequelize = require('../database/db');

module.exports= sequelize.define('Container', {
    container_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        
    },

});
