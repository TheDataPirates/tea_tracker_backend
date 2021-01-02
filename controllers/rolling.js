const dhool = require("../models/dhool");
const batch = require("../models/batch");
const Sequelize = require("sequelize");
const { DATE } = require("sequelize");
const Op = Sequelize.Op;


exports.getRollings = async (req, res, next) => {
  try {
    const allRollings = await dhool.findAll();

    res.status(200).json({
      rollings: allRollings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createRolling = async (req, res, next) => {
  const id = req.body.id;
  const batch_no = req.body.batchNumber;
  const rolling_turn = req.body.rollingTurn;
  const roller_no = req.body.rollerNumber;
  const weight_in = req.body.weightIn;
  const weight_out = req.body.weightOut;
  const time = req.body.time;
  try {
    // console.log("Batch date in rolling dhool");
    const dateT = new Date();
    let date = ("0" + dateT.getDate()).slice(-2);
    // current month
    let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
    // current year
    let year = dateT.getFullYear();
    const dateString = date + "/" + month + "/" + year;
    // console.log(dateString);
    await dhool.create({
      id: id,
      BatchBatchNo: batch_no,
      rolling_turn: rolling_turn,
      RollerRollerId: roller_no,
      rolling_in_kg: weight_in,
      rolling_out_kg: weight_out,
      rolling_out_time: time,
      batch_date: dateString,
    });

    console.log("rolling saved");

    res.status(200).json({
      rolling: "saved",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getRollBreakings = async (req, res, next) => {
  try {
    const allRollBreakings = await dhool.findAll({
      where: {
        rolling_turn: { [Op.notLike]: "%BB" },
      },
    });

    res.status(200).json({
      rollbreakings: allRollBreakings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createRollBreaking = async (req, res, next) => {
  const id = req.body.id;
  const batch_no = req.body.batchNumber;
  const roll_break_turn = req.body.rollBreakingTurn;
  const roll_breaker_no = req.body.rollBreakerNumber;
  const weight = req.body.weight;
  const time = req.body.time;

  console.log('RBTurn');
  console.log(roll_break_turn);

  const dateT = new Date();
    let date = ("0" + dateT.getDate()).slice(-2);
    // current month
    let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
    // current year
    let year = dateT.getFullYear();
    const dateString = date + "/" + month + "/" + year;

  if(roll_break_turn === 'BB'){
    try{
      await dhool.create({
        id: id,
        BatchBatchNo: batch_no,
        batch_date: dateString,
        dhool_out_weight: weight,
        rolling_turn: roll_break_turn,
      });

      console.log("Big Bulk saved");
  
      res.status(200).json({
        rollBreaking: "saved",
      });

    }
    catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  else{
    try {
    
      const batch_weight = await batch.findAll({
        attributes: ['weight']
      },
      {
        where: {
          batch_no: batch_no,
        },
      });
      // console.log("batch weight in roll breaking");
      // console.log(batch_weight[0].dataValues.weight);
      const dhool_pct = batch_weight[0].dataValues.weight/weight;
      // console.log("dhool percentage in roll breaking");
      // console.log(dhool_pct);
      await dhool.update(
        {
          dhool_out_weight: weight,
          rb_out_time: time,
          RollBreakerRollBreakerId: roll_breaker_no,
          dhool_pct: dhool_pct
        },
        {
          where: {
            rolling_turn: roll_break_turn,
            BatchBatchNo: batch_no,
            batch_date: dateString,
          },
        }
      );
      console.log("roll breaking saved");
  
      res.status(200).json({
        rollBreaking: "updated",
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};

exports.getFermentings = async (req, res, next) => {
  try {
    const allFermentings = await dhool.findAll();

    res.status(200).json({
      fermentings: allFermentings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createFermenting = async (req, res, next) => {
  const id = req.body.id;
  const batch_no = req.body.batchNumber;
  const rb_turn = req.body.dhoolNumber;
  const dhool_in_weight = req.body.dhoolInWeight;
  const dhool_out_weight = req.body.dhoolOutWeight;
  const time = req.body.time;
  // const date = req.body.date;
  try {

    const dateT = new Date();
    let date = ("0" + dateT.getDate()).slice(-2);
    // current month
    let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
    // current year
    let year = dateT.getFullYear();
    const dateString = date + "/" + month + "/" + year;

    const fd_pct = (dhool_out_weight - dhool_in_weight)/dhool_in_weight;

    // console.log("FERMENTED DHOOL PCT in FERMENTING");
    // console.log(fd_pct);

    await dhool.update(
      {
        fd_out_kg: dhool_out_weight,
        fd_time_out: time,
        fd_pct: fd_pct, 
      },
      {
        where: {
          rolling_turn: rb_turn,
          BatchBatchNo: batch_no,
          batch_date: dateString,
        },
      }
    );
    console.log("fermenting updated");
    res.status(200).json({
      fermenting: "updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getDryings = async (req, res, next) => {
  try {
    const allDryings = await dhool.findAll();

    res.status(200).json({
      dryings: allDryings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createDrying = async (req, res, next) => {
  const id = req.body.id;
  const batch_no = req.body.batchNumber;
  const rb_turn = req.body.dhoolNumber;
  const drier_in_weight = req.body.drierInWeight;
  const drier_out_weight = req.body.drierOutWeight;
  const time = req.body.time;
  const outturn = req.body.outturn;
  // const date = req.body.date;
  try {

      const dateT = new Date();
      let date = ("0" + dateT.getDate()).slice(-2);
      // current month
      let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
      // current year
      let year = dateT.getFullYear();
      const dateString = date + "/" + month + "/" + year;

    await dhool.update(
      {
        drier_out_kg: drier_out_weight,
        drier_out_time: time,
        DrierDrierId: 1,
      },
      {
        where: {
          rolling_turn: rb_turn,
          BatchBatchNo: batch_no,
          batch_date: dateString,
        },
      }
    );
      // console.log("Outturn");
      // console.log(outturn);
    await batch.update(
      {
        outturn: outturn,
      },
      {
        where: {
          batch_no: batch_no,
          batch_date: dateString,
        },
      }
    );
    console.log("drying updated");
    res.status(200).json({
      drying: "updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
