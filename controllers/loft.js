const trough_process = require("../models/trough_process");

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
