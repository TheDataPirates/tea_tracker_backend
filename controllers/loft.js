const trough_process = require("../models/trough_process");
const Lot = require("../models/lot");
const Batch = require("../models/batch");
const Bulk = require('../models/bulk');
const Box = require('../models/box');
const {Op} = require("sequelize");


exports.getStartings = async (req, res, next) => {
    try {
        const allStartings = await trough_process.findAll({
            where: {ProcessProcessName: "starting"},
        });

        res.status(200).json({
            startings: allStartings,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
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
                    {ProcessProcessName: "mixing1"},
                    {ProcessProcessName: "mixing2"},
                    {ProcessProcessName: "mixing3"},
                ],
            },
        });
        res.status(200).json({
            mixings: allMixings,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
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
            where: {ProcessProcessName: "finishing"},
        });
        res.status(200).json({
            finishings: allFinishings,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
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
        const allLoadings = await Lot.findAll();
        res.status(200).json({
            loadings: allLoadings,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.createLoading = async (req, res, next) => {
    const id = req.body.id;
    const trough_no = req.body.troughNumber;
    const date = req.body.date;
    const box_no = req.body.boxNumber;
    const leaf_grade = req.body.gradeOfGL;
    const net_weight = req.body.netWeight;
    const lot__id = req.body.lotId;

    const box_id = "T" + trough_no + "B" + box_no;//T+trough_no+B+box_no
    try {
        // await Loaded_Bulk_Box.create({
        //   load_bulk_box_id: id,
        //   date: date,
        //   leaf_grade: leaf_grade,
        //   net_weight: net_weight,
        //   box_number: box_no,
        //   trough_number: trough_no,
        // });

        await Lot.update({
            BoxBoxId: box_id
        }, {
            where: {
                lot_id: lot__id
            }
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

exports.getBatches = async (req, res, next) => {
    try {
        const allBatches = await Batch.findAll();
        res.status(200).json({
            Batches: allBatches,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createBatch = async (req, res, next) => {
    const id = req.body.id;
    const batchNumber = req.body.batchNumber;
    const batchWeight = req.body.batchWeight;
    const time = req.body.time;
    try {

        const dateT = new Date();
        let date = ("0" + dateT.getDate()).slice(-2);
        // current month
        let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
        // current year
        let year = dateT.getFullYear();
        const dateString = date + "/" + month + "/" + year;

        await Batch.create({
            batch_no: batchNumber,
            batch_date: dateString,
            weight: batchWeight,
            outturn: 0,
        });

        console.log("batch saved");
        res.status(200).json({
            Batches: "saved",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


// Reporting

exports.getLoftLoadingForReporting = async (req, res, next) => {
    try {

        let boxWiseTotalNetWeight;
        let boxWiseWitheringPct;
        let date;
        let boxesArray = [];
        const bulkID = await Bulk.findAll({
            attributes: ['bulk_id', 'date'],
            where: {date: new Date('2021-03-19')} // date should be yesterday not today
        });
        if(bulkID.length === 0){
            console.log('empty bulks');
        }
        for (const bulk_id_ele of bulkID) {

            boxWiseTotalNetWeight = await Lot.findAll({
                attributes: ['grade_GL', 'BoxBoxId', [sequelize.fn('sum', sequelize.col('net_weight')), 'total_Net_weight'],],
                where: {BulkBulkId: bulk_id_ele.dataValues.bulk_id,},
                group: ['BoxBoxId']
//date:{$between: [dateString, endDate]
            });
            date = bulk_id_ele.dataValues.date;
            // console.log(boxWiseTotalNetWeight);
            for (let lots_ele of boxWiseTotalNetWeight) {

//                 boxWiseWitheringPct = await Box.findAll({
//                     attributes: ['withered_pct'],
//                     where: {box_id: lots_ele.dataValues.BoxBoxId}
// //date:{$between: [dateString, endDate]
//                 });
//                 lots_ele.dataValues.withered_pct = boxWiseWitheringPct[0].dataValues.withered_pct;


                // console.log(boxWiseWitheringPct);
                if (boxesArray.length === 0) {
                    // console.log(lots_ele.dataValues);
                    boxesArray.push(lots_ele.dataValues);
                    continue;
                }
                // console.log(boxesArray.length);
                // console.log('before for');
                let flag = 0; // used to identify existing box and push new boxes to array
                for (let lot of boxesArray) {
                    // console.log("inside for");
                    if (lot.BoxBoxId === lots_ele.dataValues.BoxBoxId) {
                        // console.log("inside if");
                        // console.log(parseInt(lot.total_Net_weight));
                        // console.log(parseInt(lots_ele.dataValues.total_Net_weight));
                        let newWeight = parseInt(lot.total_Net_weight) + parseInt(lots_ele.dataValues.total_Net_weight);

                        lot.total_Net_weight = newWeight.toString();
                        lot.date = date;


                        // console.log(lot);
                        flag = 1;

                        break;
                    }
                    lot.date = date;

                }
                if (flag === 0) {
                    // console.log("outside for");
                    lots_ele.dataValues.date = date;

                    // console.log(lots_ele.dataValues);
                    boxesArray.push(lots_ele.dataValues);
                }
            }
            console.log(boxesArray);

            //
            // gradeWiseLotTotalArray.push(lotWithDate);
            // lotWithDate = {};

        }

        res.status(200).json({
            loading: boxesArray,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getLoftUnloadingForReporting = async (req, res, next) => {
    try {

        let boxWiseGradeLeaf;
        let boxWiseWitheringPct;
        let date;
        let boxesArray = [];
        const boxID = await Box.findAll({
            attributes: ['box_id', 'withered_pct','unloading_weight','BatchBatchNo','date'],
            where: {date: new Date()}
        });

        if(boxID.length === 0){
            console.log('empty boxID');
        }
        for (const box_id_ele of boxID) {

            boxWiseGradeLeaf = await Lot.findAll({
                attributes: ['grade_GL'],
                where: {BoxBoxId: box_id_ele.dataValues.box_id,},
                group: ['BoxBoxId']
//date:{$between: [dateString, endDate]
            });
            // console.log(boxWiseTotalNetWeight);
            box_id_ele.grade_GL = boxWiseGradeLeaf[0].dataValues.grade_GL;

            console.log(box_id_ele);

            //
            // gradeWiseLotTotalArray.push(lotWithDate);
            // lotWithDate = {};

        }

        res.status(200).json({
            unloading: boxID,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};