const dhool = require("../models/dhool");
const batch = require("../models/batch");
const Box = require('../models/box');
const Lot = require("../models/lot");
const Bulk = require("../models/bulk");
const Sequelize = require("sequelize");
const { DATE } = require("sequelize");
const lot = require("../models/lot");
const box = require("../models/box");
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
        // const dateT = new Date();
        // let date = ("0" + dateT.getDate()).slice(-2);
        // // current month
        // let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
        // // current year
        // let year = dateT.getFullYear();
        // const dateString = date + "/" + month + "/" + year;
        // console.log(dateString);
        await dhool.create({
            id: id,
            BatchBatchNo: batch_no,
            rolling_turn: rolling_turn,
            RollerRollerId: roller_no,
            rolling_in_kg: weight_in,
            rolling_out_kg: weight_out,
            rolling_out_time: time,
            batch_date: new Date(),
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

    // const dateT = new Date();
    //   let date = ("0" + dateT.getDate()).slice(-2);
    //   // current month
    //   let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
    //   // current year
    //   let year = dateT.getFullYear();
    //   const dateString = date + "/" + month + "/" + year;

    if (roll_break_turn === 'BB') {
        try {
            await dhool.create({
                id: id,
                BatchBatchNo: batch_no,
                batch_date: new Date(),
                dhool_out_weight: weight,
                rolling_turn: roll_break_turn,
            }).catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });

            console.log("Big Bulk saved");

            res.status(200).json({
                rollBreaking: "saved",
            });

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    } else {
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
            const dhool_pct = batch_weight[0].dataValues.weight / weight;
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
                        batch_date: new Date(),
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
    // try {

    // const dateT = new Date();
    // let date = ("0" + dateT.getDate()).slice(-2);
    // // current month
    // let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
    // // current year
    // let year = dateT.getFullYear();
    // const dateString = date + "/" + month + "/" + year;

    const fd_pct = (dhool_out_weight - dhool_in_weight) / dhool_in_weight;

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
                batch_date: new Date(),
            },
        }
    ).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    console.log("fermenting updated");
    res.status(200).json({
        fermenting: "updated",
    });
    // }
    // catch (err) {
    //   if (!err.statusCode) {
    //     err.statusCode = 500;
    //   }
    //   next(err);
    // }
};


exports.getDryings = async (req, res, next) => {
    try {
        const allDryings = await dhool.findAll();

        res.status(200).json({
            dryings: allDryings,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
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

        // const dateT = new Date();
        // let date = ("0" + dateT.getDate()).slice(-2);
        // // current month
        // let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
        // // current year
        // let year = dateT.getFullYear();
        // const dateString = date + "/" + month + "/" + year;

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
                    batch_date: new Date(),
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
                    batch_date: new Date(),
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

// Reporting
exports.getRollingForReporting = async (req, res, next) => {
    try {
        const allRolling = await dhool.findAll({
            attributes: ['BatchBatchNo', 'RollerRollerId', 'batch_date', 'rolling_turn', 'rolling_in_kg', 'rolling_out_kg'],
            where: {
                // batch_date: {[Op.between]: [ new Date(new Date() - 30 * 24 * 60 * 60 * 1000),new Date()]},
                batch_date: new Date('2021-03-30')
            },
        });
        // console.log(allRolling);
        for (const batch_no_ele of allRolling) {

            const boxID = await Box.findAll({
                attributes: ['box_id'],
                // where: {date: new Date()}
                where: { BatchBatchNo: batch_no_ele.dataValues.BatchBatchNo, date: batch_no_ele.dataValues.batch_date }
            });
            for (const box_no_ele of boxID) {
                const grade_GL = await Lot.findAll({
                    attributes: ['grade_GL', 'BoxBoxId'],
                    where: { BoxBoxId: box_no_ele.dataValues.box_id },

                });
                if (grade_GL.length !== 0) {
                    batch_no_ele.dataValues.grade_GL = grade_GL[0].dataValues.grade_GL;
                    // console.log(grade_GL[0].dataValues.grade_GL);
                }
            }

        }

        res.status(200).json({
            rolling: allRolling,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getRollBreakingForReporting = async (req, res, next) => {
    try {
        const allRollBreaking = await dhool.findAll({
            attributes: ['BatchBatchNo', 'RollBreakerRollBreakerId', 'batch_date', 'rolling_turn', 'rolling_out_kg', 'dhool_out_weight', 'dhool_pct'],
            where: {
                // batch_date: {[Op.between]: [ new Date(new Date() - 30 * 24 * 60 * 60 * 1000),new Date()]},
                batch_date: new Date('2021-03-30')
            },
        });
        // console.log(allRolling);
        for (const batch_no_ele of allRollBreaking) {

            const boxID = await Box.findAll({
                attributes: ['box_id'],
                // where: {date: new Date()}
                where: { BatchBatchNo: batch_no_ele.dataValues.BatchBatchNo, date: batch_no_ele.dataValues.batch_date }
            });
            for (const box_no_ele of boxID) {
                const grade_GL = await Lot.findAll({
                    attributes: ['grade_GL', 'BoxBoxId'],
                    where: { BoxBoxId: box_no_ele.dataValues.box_id },

                });
                if (grade_GL.length !== 0) {
                    batch_no_ele.dataValues.grade_GL = grade_GL[0].dataValues.grade_GL;
                    // console.log(grade_GL[0].dataValues.grade_GL);
                }
            }

        }

        res.status(200).json({
            rollBreaking: allRollBreaking,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }


}

exports.getFermentingForReporting = async (req, res, next) => {
    try {
        const allFermentings = await dhool.findAll({
            attributes: ['BatchBatchNo', 'batch_date', 'rolling_turn', 'dhool_out_weight', 'fd_out_kg', 'fd_pct'],
            where: {
                // batch_date: {[Op.between]: [ new Date(new Date() - 30 * 24 * 60 * 60 * 1000),new Date()]},
                batch_date: new Date('2021-03-30')
            },
        });
        // console.log(allRolling);
        for (const batch_no_ele of allFermentings) {

            const boxID = await Box.findAll({
                attributes: ['box_id'],
                // where: {date: new Date()}
                where: { BatchBatchNo: batch_no_ele.dataValues.BatchBatchNo, date: batch_no_ele.dataValues.batch_date }
            });
            for (const box_no_ele of boxID) {
                const grade_GL = await Lot.findAll({
                    attributes: ['grade_GL', 'BoxBoxId'],
                    where: { BoxBoxId: box_no_ele.dataValues.box_id },

                });
                if (grade_GL.length !== 0) {
                    batch_no_ele.dataValues.grade_GL = grade_GL[0].dataValues.grade_GL;
                    // console.log(grade_GL[0].dataValues.grade_GL);
                }
            }

        }

        res.status(200).json({
            fermenting: allFermentings,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }


}

exports.getDryingForReporting = async (req, res, next) => {
    try {
        const allDrying = await dhool.findAll({
            attributes: ['BatchBatchNo', 'batch_date', 'rolling_turn', 'fd_out_kg', 'drier_out_kg'],
            where: {
                // batch_date: {[Op.between]: [ new Date(new Date() - 30 * 24 * 60 * 60 * 1000),new Date()]},
                batch_date: new Date('2021-03-30')
            },
        });
        // console.log(allRolling);
        for (const batch_no_ele of allDrying) {

            const boxID = await Box.findAll({
                attributes: ['box_id'],
                // where: {date: new Date()}
                where: { BatchBatchNo: batch_no_ele.dataValues.BatchBatchNo, date: batch_no_ele.dataValues.batch_date }
            });
            for (const box_no_ele of boxID) {
                const grade_GL = await Lot.findAll({
                    attributes: ['grade_GL', 'BoxBoxId'],
                    where: { BoxBoxId: box_no_ele.dataValues.box_id },

                });
                if (grade_GL.length !== 0) {
                    batch_no_ele.dataValues.grade_GL = grade_GL[0].dataValues.grade_GL;
                    // console.log(grade_GL[0].dataValues.grade_GL);
                }
            }

        }

        res.status(200).json({
            drying: allDrying,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }


}

exports.getOutturnForReporting = async (req, res, next) => {
    let allBulks = [];
    let lots = [];
    let batches = [];
    let outturns = [];
    let batchLeafGradesArray = [];
    let batchLeafGrades = {};

    try {
        for (let i = 1; i <= 5; i++) { //Should be 30 days
            allBulks = await Bulk.findAll({
                attributes: ['bulk_id', 'date'],
                where: {
                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000), //THis date should be yesterday
                    method: { [Op.notLike]: 'AgentOriginal' },
                },
            });
            for (const bulk_no_ele of allBulks) {
                lots = await Lot.findAll({
                    attributes: ['grade_GL', 'BoxBoxId'],
                    where: { BulkBulkId: bulk_no_ele.dataValues.bulk_id },

                });
                // console.log(lots);
                for (const box_id of lots) {
                    batches = await box.findAll({
                        attributes: ['BatchBatchNo', 'date'],
                        where: { box_id: box_id.dataValues.BoxBoxId, date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000) },//THis date should be yesterday
                    });

                    for (const batch_id of batches) {
                        outturns = await batch.findAll({
                            attributes: ['batch_no', 'batch_date', 'outturn'],
                            where: { batch_date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000), batch_no: batch_id.dataValues.BatchBatchNo },//new Date(new Date('2021-03-30') - (i-1) * 24 * 60 * 60 * 1000)
                        });
                        // outturns.dataValues.leaf_grade = box_id.dataValues.grade_GL;
                        // console.log(outturns);
                        for (const out_id of outturns) {
                            batchLeafGrades = { batch_no: out_id.dataValues.batch_no, batch_date: out_id.dataValues.batch_date, outturn: out_id.dataValues.outturn, leafGrade: box_id.dataValues.grade_GL };
                            // console.log(batches);
                            // if (batches.length === 0) {
                            //     break
                            // }
                            if (batchLeafGradesArray.length === 0) {
                                batchLeafGradesArray.push(batchLeafGrades);
                            } else {
                                let flag = 0;
                                for (let batch of batchLeafGradesArray) {
                                    if (batch.batch_no === batchLeafGrades.batch_no && batch.batch_date === batchLeafGrades.batch_date) {
                                        flag = 1;
                                        break;
                                    }
                                }
                                if (flag === 0) {
                                    batchLeafGradesArray.push(batchLeafGrades);
                                }
                            }
                            // batchLeafGradesArray.push(batchLeafGrades);
                        }
                    }
                }
            }

        }


        res.status(200).json({
            dhools: batchLeafGradesArray,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


//Dashboard

// exports.getDailyDhoolPct = async (req, res, next) => {
//     try {
//         let allBulks = [];
//         let lots = [];
//         let batches = [];
//         let dhools = [];
//
//         for (let i = 1; i <= 7; i++) {
//             allBulks = await Bulk.findAll({
//                 attributes: ['bulk_id', 'date'],
//                 where: {
//                     date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000), method: { [Op.notLike]: 'AgentOriginal' },
//                 },
//             });
//
//             for (const bulk_no_ele of allBulks) {
//
//                 lots = await Lot.findAll({
//                     attributes: ['lot_id', 'grade_GL', 'BoxBoxId'],
//                     where: { BulkBulkId: bulk_no_ele.dataValues.bulk_id },
//                     group: ['grade_GL']
//                 });
//                 // console.log(lots);
//                 for (const lot_no_ele of lots) {
//                     batches = await Box.findAll({
//                         attributes: ['box_id', 'BatchBatchNo'],
//                         where: { box_id: lot_no_ele.dataValues.BoxBoxId, date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000) },
//                     });
//                     console.log(batches);
//                     // if (grade_GL.length !== 0) {
//                     //     batch_no_ele.dataValues.grade_GL = grade_GL[0].dataValues.grade_GL;
//                     //     // console.log(grade_GL[0].dataValues.grade_GL);
//                     // }
//                     // for (const batch_no of batches) {
//                     //     dhools = await dhool.findAll({
//                     //         attributes: [[sequelize.fn('sum', sequelize.col('dhool_pct')), 'total_dhool_pct'], 'BatchBatchNo'],
//                     //         where: { BatchBatchNo: batch_no.dataValues.BatchBatchNo, date: new Date('2021-03-30')},
//                     //         group: ['BatchBatchNo']
//                     //     });
//                     //     console.log(dhools);
//                     // }
//                 }
//
//             }
//         }
//
//         res.status(200).json({
//             dhools: allBulks,
//         });
//     } catch (error) {
//         if (!error.statusCode) {
//             error.statusCode = 500;
//         }
//         next(error);
//     }
//
//
// }

exports.getDailyDhoolPct = async (req, res, next) => {
    let allBulks = [];
    let lots = [];
    let leafGLABatches = [];
    let leafGLBBatches = [];
    let leafGLCBatches = [];
    let totalGLAPct = 0;
    let totalGLBPct = 0;
    let totalGLCPct = 0;
    let avgGLA = 0;
    let avgGLB = 0;
    let avgGLC = 0;
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let dhoolele = {};
    let dhoolArray = [];
    try {
        for (let i = 1; i <= 7; i++) {
            allBulks = await Bulk.findAll({
                attributes: ['bulk_id', 'date'],
                where: {
                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000),
                    method: { [Op.notLike]: 'AgentOriginal' },
                },
            });
            for (const bulk_no_ele of allBulks) {
                lots = await Lot.findAll({
                    attributes: ['grade_GL', 'BoxBoxId'],
                    where: { BulkBulkId: bulk_no_ele.dataValues.bulk_id },
                    // group: ['grade_GL']
                });
                // console.log(lots);
                for (const lot_no_ele of lots) {
                    switch (lot_no_ele.dataValues.grade_GL) {
                        case 'A':
                            const boxID = await Box.findAll({
                                attributes: ['BatchBatchNo'],
                                // where: {date: new Date()}
                                where: {
                                    box_id: lot_no_ele.dataValues.BoxBoxId,
                                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                }
                            });
                            if (boxID.length === 0) {
                                break
                            }
                            if (leafGLABatches.length === 0) {
                                leafGLABatches.push(parseInt(boxID[0].dataValues.BatchBatchNo));
                            } else {
                                let flag = 0;
                                for (let batch of leafGLABatches) {
                                    if (batch === boxID[0].dataValues.BatchBatchNo) {
                                        flag = 1;
                                        break;
                                    }
                                }
                                if (flag === 0) {
                                    leafGLABatches.push(boxID[0].dataValues.BatchBatchNo);
                                }
                            }
                            break;
                        case 'B':
                            const boxIDForB = await Box.findAll({
                                attributes: ['BatchBatchNo'],
                                // where: {date: new Date()}
                                where: {
                                    box_id: lot_no_ele.dataValues.BoxBoxId,
                                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                }
                            });
                            if (boxIDForB.length === 0) {
                                break
                            }
                            if (leafGLBBatches.length === 0) {
                                leafGLBBatches.push(parseInt(boxIDForB[0].dataValues.BatchBatchNo));
                            } else {
                                let flag = 0;
                                for (let batch of leafGLBBatches) {
                                    if (batch === boxIDForB[0].dataValues.BatchBatchNo) {
                                        flag = 1;
                                        break;
                                    }
                                }
                                if (flag === 0) {
                                    leafGLBBatches.push(boxIDForB[0].dataValues.BatchBatchNo);
                                }
                            }
                            break;
                        case 'C':
                            const boxIDForC = await Box.findAll({
                                attributes: ['BatchBatchNo'],
                                // where: {date: new Date()}
                                where: {
                                    box_id: lot_no_ele.dataValues.BoxBoxId,
                                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                }
                            });
                            if (boxIDForC.length === 0) {
                                break
                            }
                            if (leafGLCBatches.length === 0) {
                                leafGLCBatches.push(parseInt(boxIDForC[0].dataValues.BatchBatchNo));
                            } else {
                                let flag = 0;
                                for (let batch of leafGLCBatches) {
                                    if (batch === boxIDForC[0].dataValues.BatchBatchNo) {
                                        flag = 1;
                                        break;
                                    }
                                }
                                if (flag === 0) {
                                    leafGLCBatches.push(boxIDForC[0].dataValues.BatchBatchNo);
                                }
                            }
                            break
                        default:
                            break;
                    }

                }
            }
            for (let batch of leafGLABatches) {
                const dhool_pct = await dhool.findAll({
                    attributes: ['dhool_pct'],
                    where: {
                        rolling_turn: { [Op.notLike]: "BB" },
                        BatchBatchNo: batch,
                        batch_date: new Date(new Date('2021-03-30') - (i - 1) * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                    },
                });

                for (let dhool_pct_ele of dhool_pct) {
                    totalGLAPct = totalGLAPct + dhool_pct_ele.dataValues.dhool_pct;
                    countA = countA + 1;
                }

            }
            avgGLA = totalGLAPct / countA;

            for (let batch of leafGLBBatches) {
                const dhool_pct = await dhool.findAll({
                    attributes: ['dhool_pct'],
                    where: {
                        rolling_turn: { [Op.notLike]: "BB" },
                        BatchBatchNo: batch,
                        batch_date: new Date(new Date('2021-03-30') - (i - 1) * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                    },
                });

                for (let dhool_pct_ele of dhool_pct) {
                    totalGLBPct = totalGLBPct + dhool_pct_ele.dataValues.dhool_pct;
                    countB = countB + 1;
                }

            }
            avgGLB = totalGLBPct / countB;

            for (let batch of leafGLCBatches) {
                const dhool_pct = await dhool.findAll({
                    attributes: ['dhool_pct'],
                    where: {
                        rolling_turn: { [Op.notLike]: "BB" },
                        BatchBatchNo: batch,
                        batch_date: new Date(new Date('2021-03-30') - (i - 1) * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                    },
                });

                for (let dhool_pct_ele of dhool_pct) {
                    totalGLCPct = totalGLCPct + dhool_pct_ele.dataValues.dhool_pct;
                    countC = countC + 1;
                }

            }
            avgGLC = totalGLCPct / countC;



            dhoolele = {
                date: new Date(new Date('2021-03-30') - (i - 1) * 24 * 60 * 60 * 1000),
                a: avgGLA,
                b: avgGLB,
                c: avgGLC
            }
            dhoolArray.push(dhoolele);

            // console.log(avgGLA);
            // console.log(avgGLB);
            // console.log(avgGLC);
            leafGLABatches = [];
            leafGLBBatches = [];
            leafGLCBatches = [];
            totalGLAPct = 0;
            totalGLBPct = 0;
            totalGLCPct = 0;
            countA = 0;
            countB = 0;
            countC = 0;
            avgGLA = 0;
            avgGLB = 0;
            avgGLC = 0;

        }


        res.status(200).json({
            dhools: dhoolArray,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getDailyFermentingDhoolPct = async (req, res, next) => {
    let allBulks = [];
    let lots = [];
    let leafGLABatches = [];
    let leafGLBBatches = [];
    let leafGLCBatches = [];
    let totalGLAPct = 0;
    let totalGLBPct = 0;
    let totalGLCPct = 0;
    let avgGLA = 0;
    let avgGLB = 0;
    let avgGLC = 0;
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let dhoolele = {};
    let dhoolArray = [];
    try {
        for (let i = 1; i <= 7; i++) {
            allBulks = await Bulk.findAll({
                attributes: ['bulk_id', 'date'],
                where: {
                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000),
                    method: { [Op.notLike]: 'AgentOriginal' },
                },
            });
            for (const bulk_no_ele of allBulks) {
                lots = await Lot.findAll({
                    attributes: ['grade_GL', 'BoxBoxId'],
                    where: { BulkBulkId: bulk_no_ele.dataValues.bulk_id },
                    // group: ['grade_GL']
                });
                // console.log(lots);
                for (const lot_no_ele of lots) {
                    switch (lot_no_ele.dataValues.grade_GL) {
                        case 'A':
                            const boxID = await Box.findAll({
                                attributes: ['BatchBatchNo'],
                                // where: {date: new Date()}
                                where: {
                                    box_id: lot_no_ele.dataValues.BoxBoxId,
                                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                }
                            });
                            if (boxID.length === 0) {
                                break
                            }
                            if (leafGLABatches.length === 0) {
                                leafGLABatches.push(parseInt(boxID[0].dataValues.BatchBatchNo));
                            } else {
                                let flag = 0;
                                for (let batch of leafGLABatches) {
                                    if (batch === boxID[0].dataValues.BatchBatchNo) {
                                        flag = 1;
                                        break;
                                    }
                                }
                                if (flag === 0) {
                                    leafGLABatches.push(boxID[0].dataValues.BatchBatchNo);
                                }
                            }
                            break;
                        case 'B':
                            const boxIDForB = await Box.findAll({
                                attributes: ['BatchBatchNo'],
                                // where: {date: new Date()}
                                where: {
                                    box_id: lot_no_ele.dataValues.BoxBoxId,
                                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                }
                            });
                            if (boxIDForB.length === 0) {
                                break
                            }
                            if (leafGLBBatches.length === 0) {
                                leafGLBBatches.push(parseInt(boxIDForB[0].dataValues.BatchBatchNo));
                            } else {
                                let flag = 0;
                                for (let batch of leafGLBBatches) {
                                    if (batch === boxIDForB[0].dataValues.BatchBatchNo) {
                                        flag = 1;
                                        break;
                                    }
                                }
                                if (flag === 0) {
                                    leafGLBBatches.push(boxIDForB[0].dataValues.BatchBatchNo);
                                }
                            }
                            break;
                        case 'C':
                            const boxIDForC = await Box.findAll({
                                attributes: ['BatchBatchNo'],
                                // where: {date: new Date()}
                                where: {
                                    box_id: lot_no_ele.dataValues.BoxBoxId,
                                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                }
                            });
                            if (boxIDForC.length === 0) {
                                break
                            }
                            if (leafGLCBatches.length === 0) {
                                leafGLCBatches.push(parseInt(boxIDForC[0].dataValues.BatchBatchNo));
                            } else {
                                let flag = 0;
                                for (let batch of leafGLCBatches) {
                                    if (batch === boxIDForC[0].dataValues.BatchBatchNo) {
                                        flag = 1;
                                        break;
                                    }
                                }
                                if (flag === 0) {
                                    leafGLCBatches.push(boxIDForC[0].dataValues.BatchBatchNo);
                                }
                            }
                            break
                        default:
                            break;
                    }

                }
            }
            for (let batch of leafGLABatches) {
                const dhool_pct = await dhool.findAll({
                    attributes: ['fd_pct'],
                    where: {
                        // rolling_turn: {[Op.notLike]: "BB"},
                        BatchBatchNo: batch,
                        batch_date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                    },
                });

                for (let dhool_pct_ele of dhool_pct) {
                    totalGLAPct = totalGLAPct + dhool_pct_ele.dataValues.fd_pct;
                    countA = countA + 1;
                }

            }
            avgGLA = totalGLAPct / countA;

            for (let batch of leafGLBBatches) {
                const dhool_pct = await dhool.findAll({
                    attributes: ['fd_pct'],
                    where: {
                        BatchBatchNo: batch,
                        batch_date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                    },
                });

                for (let dhool_pct_ele of dhool_pct) {
                    totalGLBPct = totalGLBPct + dhool_pct_ele.dataValues.fd_pct;
                    countB = countB + 1;
                }

            }
            avgGLB = totalGLBPct / countB;

            for (let batch of leafGLCBatches) {
                const dhool_pct = await dhool.findAll({
                    attributes: ['fd_pct'],
                    where: {
                        // rolling_turn: {[Op.notLike]: "BB"},
                        BatchBatchNo: batch,
                        batch_date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                    },
                });

                for (let dhool_pct_ele of dhool_pct) {
                    totalGLCPct = totalGLCPct + dhool_pct_ele.dataValues.fd_pct;
                    countC = countC + 1;
                }

            }
            avgGLC = totalGLCPct / countC;



            dhoolele = {
                date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000), //this should be i - 1 not i
                a: avgGLA,
                b: avgGLB,
                c: avgGLC
            }
            dhoolArray.push(dhoolele);

            // console.log(avgGLA);
            // console.log(avgGLB);
            // console.log(avgGLC);
            leafGLABatches = [];
            leafGLBBatches = [];
            leafGLCBatches = [];
            totalGLAPct = 0;
            totalGLBPct = 0;
            totalGLCPct = 0;
            countA = 0;
            countB = 0;
            countC = 0;
            avgGLA = 0;
            avgGLB = 0;
            avgGLC = 0;

        }


        res.status(200).json({
            fdDhools: dhoolArray,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

};


exports.getRollerWiseDhoolPct = async (req, res, next) => {
    let allBulks = [];
    let lots = [];
    let leafGLABatches = [];
    let leafGLBBatches = [];
    let leafGLCBatches = [];
    let totalGLAPct = 0;
    let totalGLBPct = 0;
    let totalGLCPct = 0;
    let avgGLA = 0;
    let avgGLB = 0;
    let avgGLC = 0;
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let dhoolele = {};
    let dhoolArray = [];
    let dhoolArrayRollerWise = [];
    try {
        for (let j = 1; j <= 4; j++) {
            for (let i = 1; i <= 7; i++) {
                allBulks = await Bulk.findAll({
                    attributes: ['bulk_id', 'date'],
                    where: {
                        date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000),
                        method: { [Op.notLike]: 'AgentOriginal' },
                    },
                });
                for (const bulk_no_ele of allBulks) {
                    lots = await Lot.findAll({
                        attributes: ['grade_GL', 'BoxBoxId'],
                        where: { BulkBulkId: bulk_no_ele.dataValues.bulk_id },
                        // group: ['grade_GL']
                    });
                    // console.log(lots);
                    for (const lot_no_ele of lots) {
                        switch (lot_no_ele.dataValues.grade_GL) {
                            case 'A':
                                const boxID = await Box.findAll({
                                    attributes: ['BatchBatchNo'],
                                    // where: {date: new Date()}
                                    where: {
                                        box_id: lot_no_ele.dataValues.BoxBoxId,
                                        date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                    }
                                });
                                if (boxID.length === 0) {
                                    break
                                }
                                if (leafGLABatches.length === 0) {
                                    leafGLABatches.push(parseInt(boxID[0].dataValues.BatchBatchNo));
                                } else {
                                    let flag = 0;
                                    for (let batch of leafGLABatches) {
                                        if (batch === boxID[0].dataValues.BatchBatchNo) {
                                            flag = 1;
                                            break;
                                        }
                                    }
                                    if (flag === 0) {
                                        leafGLABatches.push(boxID[0].dataValues.BatchBatchNo);
                                    }
                                }
                                break;
                            case 'B':
                                const boxIDForB = await Box.findAll({
                                    attributes: ['BatchBatchNo'],
                                    // where: {date: new Date()}
                                    where: {
                                        box_id: lot_no_ele.dataValues.BoxBoxId,
                                        date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                    }
                                });
                                if (boxIDForB.length === 0) {
                                    break
                                }
                                if (leafGLBBatches.length === 0) {
                                    leafGLBBatches.push(parseInt(boxIDForB[0].dataValues.BatchBatchNo));
                                } else {
                                    let flag = 0;
                                    for (let batch of leafGLBBatches) {
                                        if (batch === boxIDForB[0].dataValues.BatchBatchNo) {
                                            flag = 1;
                                            break;
                                        }
                                    }
                                    if (flag === 0) {
                                        leafGLBBatches.push(boxIDForB[0].dataValues.BatchBatchNo);
                                    }
                                }
                                break;
                            case 'C':
                                const boxIDForC = await Box.findAll({
                                    attributes: ['BatchBatchNo'],
                                    // where: {date: new Date()}
                                    where: {
                                        box_id: lot_no_ele.dataValues.BoxBoxId,
                                        date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                                    }
                                });
                                if (boxIDForC.length === 0) {
                                    break
                                }
                                if (leafGLCBatches.length === 0) {
                                    leafGLCBatches.push(parseInt(boxIDForC[0].dataValues.BatchBatchNo));
                                } else {
                                    let flag = 0;
                                    for (let batch of leafGLCBatches) {
                                        if (batch === boxIDForC[0].dataValues.BatchBatchNo) {
                                            flag = 1;
                                            break;
                                        }
                                    }
                                    if (flag === 0) {
                                        leafGLCBatches.push(boxIDForC[0].dataValues.BatchBatchNo);
                                    }
                                }
                                break
                            default:
                                break;
                        }

                    }
                }
                for (let batch of leafGLABatches) {
                    const dhool_pct = await dhool.findAll({
                        attributes: ['dhool_pct'],
                        where: {
                            rolling_turn: { [Op.notLike]: "BB" },
                            RollerRollerId: j,
                            BatchBatchNo: batch,
                            batch_date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                        },
                    });

                    for (let dhool_pct_ele of dhool_pct) {
                        totalGLAPct = totalGLAPct + dhool_pct_ele.dataValues.dhool_pct;
                        countA = countA + 1;
                    }

                }
                avgGLA = totalGLAPct / countA;

                for (let batch of leafGLBBatches) {
                    const dhool_pct = await dhool.findAll({
                        attributes: ['dhool_pct'],
                        where: {
                            rolling_turn: { [Op.notLike]: "BB" },
                            RollerRollerId: j,
                            BatchBatchNo: batch,
                            batch_date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                        },
                    });

                    for (let dhool_pct_ele of dhool_pct) {
                        totalGLBPct = totalGLBPct + dhool_pct_ele.dataValues.dhool_pct;
                        countB = countB + 1;
                    }

                }
                avgGLB = totalGLBPct / countB;

                for (let batch of leafGLCBatches) {
                    const dhool_pct = await dhool.findAll({
                        attributes: ['dhool_pct'],
                        where: {
                            rolling_turn: { [Op.notLike]: "BB" },
                            RollerRollerId: j,
                            BatchBatchNo: batch,
                            batch_date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)//this should be i - 1 not i
                        },
                    });

                    for (let dhool_pct_ele of dhool_pct) {
                        totalGLCPct = totalGLCPct + dhool_pct_ele.dataValues.dhool_pct;
                        countC = countC + 1;
                    }

                }
                avgGLC = totalGLCPct / countC;

                

            }

            dhoolele = {
                rollerId: j,
                a: avgGLA,
                b: avgGLB,
                c: avgGLC
            }
            // console.log(dhoolele);
            dhoolArray.push(dhoolele);

            // console.log(avgGLA);
            // console.log(avgGLB);
            // console.log(avgGLC);
            leafGLABatches = [];
            leafGLBBatches = [];
            leafGLCBatches = [];
            totalGLAPct = 0;
            totalGLBPct = 0;
            totalGLCPct = 0;
            countA = 0;
            countB = 0;
            countC = 0;
            avgGLA = 0;
            avgGLB = 0;
            avgGLC = 0;
            
            // dhoolArrayRollerWise.push(dhoolArray);
            // dhoolArray = [];
        }


        res.status(200).json({
            dhools: dhoolArray,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}


exports.getTodayTotalMadeTea = async (req, res, next) => {


    let totalDriedDhoolWeight = 0;
    try {
        const todayDhools = await dhool.findAll({
            attributes: ['id', 'drier_out_kg'],
            where: { batch_date: new Date('2021-03-30') }, // This should be today's date
        });

        for (let dhool_id of todayDhools) {

            totalDriedDhoolWeight = totalDriedDhoolWeight + dhool_id.dataValues.drier_out_kg;

        }

        res.status(200).json({
            dhools: totalDriedDhoolWeight,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.getTodayoutturn = async (req, res, next) => {
    let totalDayOutturn = 0;
    let batchCount = 0;
    let todayOutturnAvg = 0;
    try {
        const allBatches = await batch.findAll({
            attributes: ['batch_no', 'outturn'],
            where: {
                batch_date: new Date('2021-03-30')
            },
        });

        for (let batch_id of allBatches) {
            batchCount = batchCount + 1;
            totalDayOutturn = totalDayOutturn + batch_id.dataValues.outturn;
        }

        todayOutturnAvg = totalDayOutturn / batchCount;

        todayOutturnAvg = Math.round(todayOutturnAvg * 100) / 100

        res.status(200).json({
            out: todayOutturnAvg,
        });
    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};