const Bulk = require("../models/bulk");
const Lot = require("../models/lot");
const Supplier = require("../models/supplier");
const User = require("../models/user");

exports.getLots = async (req, res, next) => {
  const allLots = await Lot.findAll().catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });

  res.status(200).json({
    lots: allLots,
  });
};

exports.createLots = async (req, res, next) => {
  const lotId = req.body.lot_id;
  const gradeGL = req.body.grade_GL;
  const gWeight = req.body.gross_weight;
  const noOfContainer = req.body.no_of_container;
  const waters = req.body.water;
  const cLeaf = req.body.course_leaf;
  const others = req.body.other;
  const netWeight = req.body.net_weight;
    const deductions = req.body.deduction;
    const bulk_id = req.body.bulkId;

  await Lot.create({
    lot_id: lotId,
    grade_GL: gradeGL,
    gross_weight: gWeight,
    no_of_container: noOfContainer,
    water: waters,
    course_leaf: cLeaf,
    other: others,
    net_weight: netWeight,
      deduction: deductions,
      bulkBulkId:bulk_id
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });

  console.log("lot saved");
  res.status(200).json({
    lots: "saved",
  });
};

exports.deleteLot = async (req, res, next) => {
  const lotId = req.params.lotid;

  let lot = await Lot.destroy({ where: { lot_id: lotId } }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
  if (!lot) {
    console.log("item not found");
    res.status(500).json({ message: "item not found" });
  } else {
    res.status(200).json({
      lots: "Deleted",
    });
  }
};

exports.createBulks = async (req, res, next) => {
  const bulkid = req.body.bulk_id;
  const userid = req.body.user_id;
  const supid = req.body.supplier_id;
  await Bulk.create({
    bulk_id: bulkid,
    UserUserId: userid,
    SupplierSupplierId: supid,
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
  res.status(200).json({
    lots: "saved",
  });

  console.log("bulk saved");
};
