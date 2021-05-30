const Sequelize = require("sequelize");

const fs = require('fs');
const rdsCa = fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem');
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     dialect: "mysql",
//     host: process.env.DB_HOST_ADDRESS,
//     port: 3306,
//     maxConcurrentQueries: 100,
//     dialectOptions: {
//         ssl: {
//             rejectUnauthorized: true,
//             ca: [rdsCa],
//         },
//         useUTC: false,
//     },
//     timezone: '+05:30',
//
//     pool: {maxConnections: 5, maxIdleTime: 30},
//     language: 'en'
// });
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: process.env.DB_HOST_ADDRESS,
  dialectOptions: {
    useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: function (field, next) {
      if (field.type === 'DATETIME') {
        return field.string()
      }
      return next()
    },
  },
  timezone: '+05:30'
});
module.exports = sequelize;
global.sequelize = sequelize;
