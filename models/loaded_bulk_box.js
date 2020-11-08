const Sequelize = require("sequelize");

const sequelize = require('../database/db');

module.exports = sequelize.define('Loaded_Bulk_Box', {
    load_bulk_box_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    date: Sequelize.DATE,
    leaf_grade: Sequelize.STRING,
    net_weight: Sequelize.DOUBLE,
    trough_number: Sequelize.INTEGER,
    box_number: Sequelize.INTEGER // This field should be removed after joining the tables Bulk and Box with M:M, because this will come as a foreighn key
});
