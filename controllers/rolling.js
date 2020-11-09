const dhool = require("../models/dhool");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getRollBreakings = async (req, res, next) => {
  try {
    const allRollBreakings = await dhool.findAll({
      where: {
        rb_turn: { [Op.notLike]: "%BB" },
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
    await dhool.create({
      id: id,
      batch_no: batch_no,
      rb_turn: roll_break_turn,
      rb_id: roll_breaker_no,
      dhool_out_weight: weight,
      rb_out_time: time,
    });
    console.log("roll breaking saved");

    res.status(200).json({
      starting: "saved",
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
          rb_turn: rb_turn,
          batch_no: batch_no,
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
