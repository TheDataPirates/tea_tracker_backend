const express = require("express");
const bodyParser = require("body-parser");

const broughtLeafRoutes = require("./routes/brought_leaf");
const authtRoutes = require("./routes/auth");

const sequelize = require("./database/db");
//define db models

const User = require("./models/user");
const Bulk = require("./models/bulk");
const Container = require("./models/container");
// const Receipt = require('./models/receipt');
const Supplier = require("./models/supplier");
const Lot = require("./models/lot");

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
app.use("/auth", authtRoutes);

// ERROR HANDLING
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//Relations
Bulk.belongsTo(User); //1:M
User.hasMany(Bulk);

Bulk.belongsTo(Supplier);
Supplier.hasMany(Bulk);

Lot.belongsTo(Bulk);
Bulk.hasMany(Lot);

Lot.belongsToMany(Container, { through: "Lot_Container" }); //M:N
Container.belongsToMany(Lot, { through: "Lot_Container" });

//CONNECTING MYSQL & SYNCING MODELS
sequelize
  .sync()
  .then((results) => {
    // console.log(results);
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
