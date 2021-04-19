const Bulk = require("../models/bulk");
const Lot = require("../models/lot");
const { Op } = require("sequelize");
const dhool = require("../models/dhool");
// const Lot_Container = require('../models/lot_container');


exports.getLots = async (req, res, next) => {

  const BulkBulkId = req.params.Bulkid;
  try {
    const allLots = await Lot.findAll({
      where: { BulkBulkId }
    });
    res.status(200).json({
      lots: allLots,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  // try {
  //   const allLots = await Lot.findAll();
  //   res.status(200).json({
  //     lots: allLots,
  //   });
  // } catch (err) {
  //   if (!err.statusCode) {
  //     err.statusCode = 500;
  //   }
  //   next(err);
  // }
};

exports.createLots = async (req, res, next) => {
  const lotId = req.body.lot_id;
  const gradeGL = req.body.grade_GL;
  const gWeight = req.body.gross_weight;
  const contType = req.body.container_type;
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
      container_type: contType
    });
    // await Lot_Container({
    //   LotLotId:lotId,
    //   ContainerContainerId:"1"
    // });
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
  const date = req.body.date;
  const method = req.body.method;

  await Bulk.create({
    bulk_id: bulkid,
    UserUserId: userid,
    SupplierSupplierId: supid,
    date: date,
    method: method,
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

exports.createLotFromLocalDb = async (req, res, next) => {
  const { lotId, no_of_containers, container_type, grade_GL, g_weight, water, course_leaf, other, bulkId, method, date, suppId, deduction, net_weight, user_Id, container1, container2, container3, container4, container5 } = req.body;


  try {
    const bulkExist = await Bulk.findOne({ where: { bulk_id: bulkId } }).catch(
      (err) => {
        //check network failures
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    );
    if (!bulkExist) {
      await Bulk.create({
        bulk_id: bulkId,
        date,
        method,
        UserUserId: user_Id,
        SupplierSupplierId: suppId,
      });
    }
    await Lot.create({
      lot_id: lotId,
      no_of_container: no_of_containers,
      grade_GL: grade_GL,
      gross_weight: g_weight,
      water: water,
      course_leaf: course_leaf,
      other,
      deduction,
      net_weight,
      container_type,
      BulkBulkId: bulkId

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

//Dashboard

exports.getSupplierLotsFirstWeek = async (req, res, next) => {

  let bulksForLastWeek = [];
  let totalNetWeight = 0;
  try {
    const suppliersForLastWeek = await Bulk.findAll({
      attributes: ['SupplierSupplierId'],
      where: { method: { [Op.notLike]: 'AgentOriginal' }, date: { [Op.between]: [new Date(new Date('2021-03-30') - 7 * 24 * 60 * 60 * 1000), new Date('2021-03-30')] }, }, // Should retrieve bulks for last seven days
      group: ['SupplierSupplierId']
    });

    for (let sup_id of suppliersForLastWeek) {
      bulksForLastWeek = await Bulk.findAll({
        attributes: ['bulk_id', 'SupplierSupplierId'],
        where: { SupplierSupplierId: sup_id.dataValues.SupplierSupplierId, date: { [Op.between]: [new Date(new Date('2021-03-30') - 7 * 24 * 60 * 60 * 1000), new Date('2021-03-30')] } },
      });
      // console.log(bulksForLastWeek);

      for (let bulk_id of bulksForLastWeek) {
        lotsForLastWeek = await Lot.findAll({
          attributes: ['BulkBulkId', 'net_weight'],
          where: { BulkBulkId: bulk_id.dataValues.bulk_id },
        });
        // console.log(lotsForLastWeek);
        for (let lot_id of lotsForLastWeek) {
          totalNetWeight = totalNetWeight + lot_id.dataValues.net_weight;
        }
        sup_id.dataValues.totalNetWeight = totalNetWeight;

      }
      totalNetWeight = 0;
    }

    // console.log(suppliersForLastWeek);


    res.status(200).json({
      lots: suppliersForLastWeek,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getSupplierLotsSecondWeek = async (req, res, next) => {

  let bulksForLastWeek = [];
  let totalNetWeight = 0;
  try {
    const suppliersForLastWeek = await Bulk.findAll({
      attributes: ['SupplierSupplierId'],
      where: { method: { [Op.notLike]: 'AgentOriginal' }, date: { [Op.between]: [new Date(new Date('2021-03-30') - 14 * 24 * 60 * 60 * 1000), new Date(new Date('2021-03-30') - 7 * 24 * 60 * 60 * 1000)] }, }, // Should retrieve bulks from last seven days to last fourteen days
      group: ['SupplierSupplierId']
    });

    for (let sup_id of suppliersForLastWeek) {
      bulksForLastWeek = await Bulk.findAll({
        attributes: ['bulk_id', 'SupplierSupplierId'],
        where: { SupplierSupplierId: sup_id.dataValues.SupplierSupplierId, date: { [Op.between]: [new Date(new Date('2021-03-30') - 14 * 24 * 60 * 60 * 1000), new Date(new Date('2021-03-30') - 7 * 24 * 60 * 60 * 1000)] } },
      });
      // console.log(bulksForLastWeek);

      for (let bulk_id of bulksForLastWeek) {
        lotsForLastWeek = await Lot.findAll({
          attributes: ['BulkBulkId', 'net_weight'],
          where: { BulkBulkId: bulk_id.dataValues.bulk_id },
        });
        // console.log(lotsForLastWeek);
        for (let lot_id of lotsForLastWeek) {
          totalNetWeight = totalNetWeight + lot_id.dataValues.net_weight;
        }
        sup_id.dataValues.totalNetWeight = totalNetWeight;

      }
      totalNetWeight = 0;
    }

    // console.log(suppliersForLastWeek);


    res.status(200).json({
      lots: suppliersForLastWeek,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getSupplierLotsThirdWeek = async (req, res, next) => {

  let bulksForLastWeek = [];
  let totalNetWeight = 0;
  try {
    const suppliersForLastWeek = await Bulk.findAll({
      attributes: ['SupplierSupplierId'],
      where: { method: { [Op.notLike]: 'AgentOriginal' }, date: { [Op.between]: [new Date(new Date('2021-03-30') - 21 * 24 * 60 * 60 * 1000), new Date(new Date('2021-03-30') - 14 * 24 * 60 * 60 * 1000)] }, }, // Should retrieve bulks from fourteen days days to last twentyone days
      group: ['SupplierSupplierId']
    });

    for (let sup_id of suppliersForLastWeek) {
      bulksForLastWeek = await Bulk.findAll({
        attributes: ['bulk_id', 'SupplierSupplierId'],
        where: { SupplierSupplierId: sup_id.dataValues.SupplierSupplierId, date: { [Op.between]: [new Date(new Date('2021-03-30') - 21 * 24 * 60 * 60 * 1000), new Date(new Date('2021-03-30') - 14 * 24 * 60 * 60 * 1000)] } },
      });
      // console.log(bulksForLastWeek);

      for (let bulk_id of bulksForLastWeek) {
        lotsForLastWeek = await Lot.findAll({
          attributes: ['BulkBulkId', 'net_weight'],
          where: { BulkBulkId: bulk_id.dataValues.bulk_id },
        });
        // console.log(lotsForLastWeek);
        for (let lot_id of lotsForLastWeek) {
          totalNetWeight = totalNetWeight + lot_id.dataValues.net_weight;
        }
        sup_id.dataValues.totalNetWeight = totalNetWeight;

      }
      totalNetWeight = 0;
    }

    // console.log(suppliersForLastWeek);


    res.status(200).json({
      lots: suppliersForLastWeek,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getSupplierLotsFourthWeek = async (req, res, next) => {

  let bulksForLastWeek = [];
  let totalNetWeight = 0;
  try {
    const suppliersForLastWeek = await Bulk.findAll({
      attributes: ['SupplierSupplierId'],
      where: { method: { [Op.notLike]: 'AgentOriginal' }, date: { [Op.between]: [new Date(new Date('2021-03-30') - 30 * 24 * 60 * 60 * 1000), new Date(new Date('2021-03-30') - 21 * 24 * 60 * 60 * 1000)] }, }, // Should retrieve bulks from last twentyone days to last thirty days
      group: ['SupplierSupplierId']
    });

    for (let sup_id of suppliersForLastWeek) {
      bulksForLastWeek = await Bulk.findAll({
        attributes: ['bulk_id', 'SupplierSupplierId'],
        where: { SupplierSupplierId: sup_id.dataValues.SupplierSupplierId, date: { [Op.between]: [new Date(new Date('2021-03-30') - 30 * 24 * 60 * 60 * 1000), new Date(new Date('2021-03-30') - 21 * 24 * 60 * 60 * 1000)] } },
      });
      // console.log(bulksForLastWeek);

      for (let bulk_id of bulksForLastWeek) {
        lotsForLastWeek = await Lot.findAll({
          attributes: ['BulkBulkId', 'net_weight'],
          where: { BulkBulkId: bulk_id.dataValues.bulk_id },
        });
        // console.log(lotsForLastWeek);
        for (let lot_id of lotsForLastWeek) {
          totalNetWeight = totalNetWeight + lot_id.dataValues.net_weight;
        }
        sup_id.dataValues.totalNetWeight = totalNetWeight;

      }
      totalNetWeight = 0;
    }

    // console.log(suppliersForLastWeek);


    res.status(200).json({
      lots: suppliersForLastWeek,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTodayPurchasedTea = async (req, res, next) => {

  let todayLots = [];
  let totalNetWeight = 0;
  try {
    const todayBulks = await Bulk.findAll({
      attributes: ['bulk_id'],
      where: { method: { [Op.notLike]: 'AgentOriginal' }, date: new Date('2021-03-30') }, // This should be today's date
    });

    for (let bulk_id of todayBulks) {
      todayLots = await Lot.findAll({
        attributes: ['net_weight'],
        where: { BulkBulkId: bulk_id.dataValues.bulk_id },
      });

      for (let lot_id of todayLots) {
        totalNetWeight = totalNetWeight + lot_id.dataValues.net_weight;
      }
    }

    res.status(200).json({
      lots: totalNetWeight,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

