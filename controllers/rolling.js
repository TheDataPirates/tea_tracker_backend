const dhool = require("../models/dhool");
const Sequelize = require("sequelize");
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
    await dhool.create({
      id: id,
      BatchBatchNo: batch_no,
      rolling_turn: rolling_turn,
      RollerRollerId: roller_no,
      rolling_in_kg: weight_in,
      rolling_out_kg: weight_out,
      rolling_out_time: time,
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
  try {
    await dhool.update(
      {
        dhool_out_weight: weight,
        rb_out_time: time,
        RollBreakerRollBreakerId: roll_breaker_no
      },
      {
        where: {
          rolling_turn: roll_break_turn,
          BatchBatchNo: batch_no,
          // batch_date: date,
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
    await dhool.update(
      {
        fd_out_kg: dhool_out_weight,
        fd_time_out: time,
      },
      {
        where: {
          rolling_turn: rb_turn,
          BatchBatchNo: batch_no,
          // batch_date: date,
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
