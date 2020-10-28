const Sequelize = require("sequelize");

const sequelize = require('../database/db');
const Container = require("./container");
const Lot = require("./lot");

module.exports= sequelize.define('Lot_Container', {
    lot_id: {
        type: Sequelize.STRING,
        references: {
            model: Lot,
            key:"lot_id"
        }
        
    },container_id: {
        type: Sequelize.STRING,
        references: {
            model: Container,
            key:"container_id"
        }
        
    }
    
});
