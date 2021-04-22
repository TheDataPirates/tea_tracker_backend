const Sequelize = require("sequelize");
const sequelize = require("../database/db");


module.exports= sequelize.define('User', {
    user_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        
    },
    email:Sequelize.STRING,
    password:Sequelize.STRING,
    name: Sequelize.STRING,
    dob: Sequelize.DATEONLY,
    user_type: Sequelize.STRING,
    telephone_no:Sequelize.STRING,
    nic:Sequelize.STRING,
    address:Sequelize.STRING,
    image:Sequelize.STRING,


},{
    timestamps: false,
});
