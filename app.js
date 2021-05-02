const fs = require('fs');
const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");

const broughtLeafRoutes = require("./routes/brought_leaf");
const authRoutes = require("./routes/auth");
const loftRoutes = require("./routes/loft");
const rollingRoutes = require("./routes/rolling");
const supplyRoutes = require("./routes/supplier");
const machineRoutes = require("./routes/machine");
const differenceReportRoutes = require("./routes/difference_report");
const sequelize = require("./database/db");
//define db models
const User = require("./models/user");
const Bulk = require("./models/bulk");
const Container = require("./models/container");
const Type = require('./models/type');
const Receipt = require('./models/receipt');
const Difference_Report = require('./models/difference_report');
const Supplier = require("./models/supplier");
const Lot = require("./models/lot");
const Lot_Container = require("./models/lot_container");
const Process = require("./models/process");
const Trough = require("./models/trough");
const Trough_Process = require("./models/trough_process");
const Batch = require("./models/batch");
const Dhool = require("./models/dhool");
const Roll_Breaker = require("./models/roll_breaker");
const Box = require("./models/box");
const Drier = require('./models/drier');
const Roller = require('./models/roller');
const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form> submit data
app.use(bodyParser.json()); // application/json <- Header for incoming json data ex:(req.body)

app.use('/uploads/images', express.static(path.join('uploads', 'images')));//frontend request can see the images (static serve)


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
app.use("/auth", authRoutes);
app.use("/loft", loftRoutes);
app.use("/rolling", rollingRoutes);
app.use("/supp",supplyRoutes);
app.use("/machine",machineRoutes);
app.use("/diff",differenceReportRoutes);


// ERROR HANDLING
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//Relations
Bulk.belongsTo(User); //M:1
User.hasMany(Bulk);

Bulk.belongsTo(Supplier); //Sequelize doesn't currently support composite foreign keys, so there is no way to reference a model/table which has composite primary keys.
Supplier.hasMany(Bulk);

Receipt.belongsTo(Bulk);// this should be 1:1, we need bulk id as fk to the receipt, so we used 1:M
Bulk.hasMany(Receipt);

Difference_Report.belongsTo(Bulk);// this should be 1:1, we need bulk id as fk to the diff_report, so we used 1:M
Bulk.hasMany(Difference_Report);

Lot.belongsTo(Bulk);
Bulk.hasMany(Lot);

Lot.belongsToMany(Container, { through: Lot_Container }); //M:N
Container.belongsToMany(Lot, { through: Lot_Container });//when using string sequelize automaticaly create table put both fk as its pks

Container.belongsTo(Type);// container M type 1
Type.hasMany(Container);


Lot.belongsTo(Box);
Box.hasMany(Lot);

Box.belongsTo(Trough);//1:M
Trough.hasMany(Box);

Process.belongsToMany(Trough, {
  through: { model: Trough_Process, unique: false },
});
Trough.belongsToMany(Process, {
  through: { model: Trough_Process, unique: false },
});

Box.belongsTo(Batch);
Batch.hasMany(Box);

Batch.belongsToMany(Roller,{through: { model: Dhool, unique: false },});//fornary btw batch roller drier roll_breaker
Roller.belongsToMany(Batch,{through: { model: Dhool, unique: false },});
Dhool.belongsTo(Roll_Breaker);
Roll_Breaker.hasMany(Dhool);
Dhool.belongsTo(Drier);
Drier.hasMany(Dhool);


//CONNECTING MYSQL & SYNCING MODELS
sequelize
  // .sync({force:true})
  .sync()
  .then((sresults) => {
    // console.log(results);
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
