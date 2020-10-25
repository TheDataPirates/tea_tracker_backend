const express = require("express");
const bodyParser = require("body-parser");


const broughtLeafRoutes = require("./routes/brought_leaf");


const sequelize = require("./database/db");
//define db models
// require('./models');
// const User = require('./models/user');
// const Bulk = require('./models/bulk');
// const Container = require('./models/container');
// const Receipt = require('./models/receipt');
// const Supplier = require('./models/supplier');


const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form> submit data
app.use(bodyParser.json()); // application/json <- Header for incoming json data ex:(req.body)

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTION,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//ROUTES
app.use("/bleaf", broughtLeafRoutes);

sequelize
  .sync()
  .then((results) => {
    // console.log(results);
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
// app.listen(8080);
//   db.authenticate().then(() => {
//       console.log('Connection established successfully.');
//       app.listen(8080);
//   }).catch(err => {
//     console.error('Unable to connect to the database:', err);
//   }).finally(() => {
//     db.close();
//   });
