const Sequelize = require("sequelize");

const sequelize = require("../database/db");

module.exports = sequelize.define("Types", {
    type_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    container_based_deduct:Sequelize.DOUBLE,
    capacity:Sequelize.INTEGER
});