const Sequelize = require("sequelize");

const sequelize = require('../database/db');

module.exports = sequelize.define('Lots', {
    lot_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    grade_GL: Sequelize.STRING,
    gross_weight: Sequelize.INTEGER,
    no_of_container: Sequelize.INTEGER,
    water: Sequelize.INTEGER,
    course_leaf: Sequelize.INTEGER,
    other: Sequelize.INTEGER,
    net_weight: Sequelize.INTEGER,
    deduction: Sequelize.INTEGER,
    
    
});

