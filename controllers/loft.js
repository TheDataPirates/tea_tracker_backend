const Trough_process = require("../models/Trough_process");
const Lot = require("../models/lot");
const Batch = require("../models/batch");
const Bulk = require('../models/bulk');
const Box = require('../models/box');
const {Op} = require("sequelize");


exports.getStartings = async (req, res, next) => {
    try {
        const allStartings = await Trough_process.findAll({
            attributes: ["tp_id","TroughTroughId","date","temperature","humidity"],
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
        await Trough_process.create({
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
        const allMixings = await Trough_process.findAll({
            attributes: ["tp_id","TroughTroughId","date","temperature","humidity","ProcessProcessName"],
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
        await Trough_process.create({
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
        const allFinishings = await Trough_process.findAll({
            attributes: ["tp_id","TroughTroughId","date","temperature","humidity"],
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
        await Trough_process.create({
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
    const time = req.body.loadingTime;


    const box_id = "T" + trough_no + "B" + box_no;//T+trough_no+B+box_no
    try {
        const loading = await Box.findAll({where:{box_id
        ,date}});

        if (loading.length===0){
            await Box.create({
                box_id: box_id,
                date: date,
                loading_time:time,
                loading_weight:net_weight
            });
        }else{
            await Box.update({
                loading_weight: sequelize.literal(`loading_weight +${net_weight}`),
                loading_time:time,
            }, {
                where: {
                    box_id: box_id,
                    date: date,
                }
            });
        }
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

exports.getUnloadings = async (req, res, next) => {
    try {
        const allUnloadings = await Box.findAll({where:{withered_pct:{
                    [Op.ne]: null
                }}});
        res.status(200).json({
            unloadings: allUnloadings,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.createUnloading = async (req, res, next) => {
    const id = req.body.id;
    const trough_no = req.body.troughNumber;
    const batch_no = req.body.batchNumber;
    const date = req.body.date;
    const box_no = req.body.boxNumber;
    const withering_pct = req.body.witheringPct;
    const lot_weight = req.body.lotWeight;
    const time = req.body.unloadingTime;


    const box_id = "T" + trough_no + "B" + box_no;//T+trough_no+B+box_no
    try {
        await Box.update({
            
            withered_pct: withering_pct,
            unloading_weight: lot_weight,
            date: date,
            unloading_time:time,
            TroughTroughId: trough_no,
            BatchBatchNo: batch_no,
        }, {
            where: {
                box_id: box_id,
                date: date,// The date should be equal to the yesterday's date as the loading of the box is done in the previous day and the unloading done in the next day
            }
        });

        console.log("Unloading saved");
        res.status(200).json({
            unloading: "saved",
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

        // const dateT = new Date();
        // let date = ("0" + dateT.getDate()).slice(-2);
        // // current month
        // let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
        // // current year
        // let year = dateT.getFullYear();
        // const dateString =  year+"-"+ month + "-" +date  ;

        await Batch.create({
            batch_no: batchNumber,
            batch_date: new Date(),
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
            where: {date: new Date('2021-03-20'),method: {[Op.notLike]: 'AgentOriginal'}} // date should be yesterday not today
        });
        if (bulkID.length === 0) {
            console.log('empty bulks');
        }
        for (const bulk_id_ele of bulkID) {

            boxWiseTotalNetWeight = await Lot.findAll({
                attributes: ['grade_GL', 'BoxBoxId', [sequelize.fn('sum', sequelize.col('net_weight')), 'total_Net_weight'],],
                where: {BulkBulkId: bulk_id_ele.dataValues.bulk_id},
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
            // console.log(boxesArray);

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


        const boxID = await Box.findAll({
            attributes: ['box_id', 'withered_pct', 'unloading_weight', 'BatchBatchNo', 'date'],
            // where: {date: new Date()} // Date dhould be yesterday because in the box table the date is inserted when loading which is the previous day.
            where:{date:new Date('2021-03-20')}
        });
        // console.log(boxID);
        const bulkID = await Bulk.findAll({
            attributes: ['bulk_id', 'date'],
            where: {date: new Date('2021-03-29'),method: {[Op.notLike]: 'AgentOriginal'}} // date should be yesterday not today
        });
        // console.log(bulkID);
        for (const bulk_id_ele of bulkID) {
            for (const box_id_ele of boxID) {
                boxWiseGradeLeaf = await Lot.findAll({
                    attributes: ['grade_GL'],
                    where: {BulkBulkId: bulk_id_ele.dataValues.bulk_id, BoxBoxId: box_id_ele.dataValues.box_id},
//date:{$between: [dateString, endDate]
                });
                // console.log(boxWiseGradeLeaf);
                if (boxWiseGradeLeaf.length !== 0) {
                    box_id_ele.dataValues.grade_GL = boxWiseGradeLeaf[0].dataValues.grade_GL;
                }
            }


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

exports.getLoftStartingForReporting = async (req, res, next) => {

    try {
        const tpID = await Trough_process.findAll({
            attributes: ['humidity', 'temperature', 'date', 'ProcessProcessName', 'TroughTroughId'],
            where: {
                // date: {[Op.between]: [new Date().setHours(0, 0, 0, 0), new Date(new Date() + 24 * 60 * 60 * 1000)]},
                date: new Date('2021-03-30'),
                ProcessProcessName: 'starting',

            } // this should be update as previous 30 days
        });
        res.status(200).json({
            starting: tpID,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

};

exports.getLoftFinishingForReporting = async (req, res, next) => {
    try {
        const tpID = await Trough_process.findAll({
            attributes: ['humidity', 'temperature', 'date', 'ProcessProcessName', 'TroughTroughId'],
            where: {
                // date: {[Op.between]: [new Date().setHours(0, 0, 0, 0), new Date(new Date() + 24 * 60 * 60 * 1000)]},
                date: new Date('2021-03-30'),
                ProcessProcessName: 'finishing'
            } // this should be update as previous 30 days
        });
        res.status(200).json({
            finishing: tpID,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.getLoftMixingForReporting = async (req, res, next) => {

    try {
        const tpID = await Trough_process.findAll({
            attributes: ['humidity', 'temperature', 'date', 'ProcessProcessName', 'TroughTroughId'],
            where: {
                // date: {[Op.between]: [new Date().setHours(0, 0, 0, 0), new Date(new Date() + 24 * 60 * 60 * 1000)]},
                date: new Date('2021-03-30'),
                ProcessProcessName: {[Op.like]: 'mixing%'}
            } // this should be update as previous 30 days
        });
        res.status(200).json({
            mixing: tpID,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}