const Sequelize = require("sequelize");
const sequelize = require("../database/db");

module.exports = sequelize.define("Supplier", {
  supplier_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: Sequelize.STRING,

  type:Sequelize.STRING,
  telephone_no:Sequelize.STRING,
  address:Sequelize.STRING,
  status:Sequelize.STRING,
  gps_location:Sequelize.STRING,
  image:Sequelize.STRING,
  date_joined:Sequelize.DATEONLY

},{
  timestamps: false,
});
