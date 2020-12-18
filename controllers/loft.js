const trough_process = require("../models/trough_process");
const Loaded_Bulk_Box = require("../models/loaded_bulk_box");
const { Op } = require("sequelize");


exports.getStartings = async (req, res, next) => {
  try {
    const allStartings = await trough_process.findAll({
      where: { ProcessProcessName: "starting" },
    });
      
    res.status(200).json({
      startings: allStartings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createStarting = async (req, res, next) => {
  const id = req.body.id;
  const trough_no = req.body.troughNumber;
  const date = req.body.time;
  const temp = req.body.temperature;
  const humid = req.body.humidity;
  const proc_name = req.body.process_name;
  try {
    await trough_process.create({
      tp_id: id,
      TroughTroughId: trough_no,
      date: date,
      temperature: temp,
      humidity: humid,
      ProcessProcessName: proc_name,
    });
    console.log("starting saved");
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

exports.getMixings = async (req, res, next) => {
  try {
    const allMixings = await trough_process.findAll({
      where: {
        [Op.or]: [
          { ProcessProcessName: "mixing1" },
          { ProcessProcessName: "mixing2" },
          { ProcessProcessName: "mixing3" },
        ],
      },
    });
    res.status(200).json({
      mixings: allMixings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.createMixing = async (req, res, next) => {
  const id = req.body.id;
  const trough_no = req.body.troughNumber;
  const date = req.body.time;
  const temp = req.body.temperature;
  const humid = req.body.humidity;
    const proc_name = req.body.process_name;
  try {
    await trough_process.create({
      tp_id: id,
      TroughTroughId: trough_no,
      date: date,
      temperature: temp,
      humidity: humid,
      ProcessProcessName: proc_name,
    });
    console.log("mixing saved");
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

exports.getFinishings = async (req, res, next) => {
  try {
    const allFinishings = await trough_process.findAll({
      where: { ProcessProcessName: "finishing" },
    });
    res.status(200).json({
      finishings: allFinishings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createFinishing = async (req, res, next) => {
  const id = req.body.id;
  const trough_no = req.body.troughNumber;
  const date = req.body.time;
  const temp = req.body.temperature;
  const humid = req.body.humidity;
  const proc_name = req.body.process_name;
  try {
    await trough_process.create({
      tp_id: id,
      TroughTroughId: trough_no,
      date: date,
      temperature: temp,
      humidity: humid,
      ProcessProcessName: proc_name,
    });
    console.log("finishing saved");
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

exports.getLoadings = async (req, res, next) => {
  try {
    const allLoadings = await Loaded_Bulk_Box.findAll();
    res.status(200).json({
      loadings: allLoadings,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createLoading = async (req, res, next) => {
  const id = req.body.id;
  const trough_no = req.body.troughNumber;
  const date = req.body.date;
  const box_no = req.body.boxNumber;
  const leaf_grade = req.body.gradeOfGL;
  const net_weight = req.body.netWeight;
  try {
    await Loaded_Bulk_Box.create({
      load_bulk_box_id: id,
      date: date,
      leaf_grade: leaf_grade,
      net_weight: net_weight,
      box_number: box_no,
      trough_number: trough_no,
    });
    // console.log(box_no);
    console.log("Loading saved");
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
