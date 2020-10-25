const Sequelize = require("sequelize");
const sequelize = require("../database/db");


module.exports= sequelize.define('User', {
    user_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        
    },
    fname: Sequelize.STRING,
    lname: Sequelize.STRING,
    dob: Sequelize.STRING,
    user_type: Sequelize.STRING,
});
