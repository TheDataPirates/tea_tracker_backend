const Sequelize = require("sequelize");

const fs = require('fs');
const rdsCa = fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: process.env.DB_HOST_ADDRESS,
  port:3306,
  maxConcurrentQueries: 100,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
      ca: [rdsCa]
    }
  },
  pool: { maxConnections: 5, maxIdleTime: 30},
  language: 'en'
});

module.exports = sequelize;
// global.sequelize = sequelize;
