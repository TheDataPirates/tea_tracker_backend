const Sequelize = require("sequelize");
const sequelize = require("../database/db");


module.exports= sequelize.define('Supplier', {
    supplier_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        
    },
    fname: Sequelize.STRING,
    
});
