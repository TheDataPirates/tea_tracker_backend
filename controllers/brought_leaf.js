const Bulk = require("../models/bulk");
const Lot = require("../models/lot");
const Supplier = require("../models/supplier");
const User = require("../models/user");

exports.getLots = async (req, res, next) => {
  try {
    const allLots = await Lot.findAll();
    res.status(200).json({
      lots: allLots,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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
  try {
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
      BulkBulkId: bulk_id,
    });
    console.log("lot saved");
    res.status(200).json({
      lots: "saved",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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
exports.createLotFromLocalDb = async (req,res,next)=>{
  const lotid = req.body.lotId;
  const noOfContainer= req.body.no_of_containers;
  const grade_GL = req.body.grade_GL;
  const g_weight = req.body.g_weight;
  const water = req.body.water;
  const course_leaf = req.body.course_leaf;

  try {
    await Lot.create({
      lot_id: lotid,
      no_of_container: noOfContainer,
      leaf_grade: grade_GL,
      gross_weight: g_weight,
      water: water,
      course_leaf: course_leaf,
    });
    // console.log(box_no);
    console.log("Lot saved from local db");
    res.status(200).json({
      lot: "saved",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

