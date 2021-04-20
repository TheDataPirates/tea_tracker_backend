const Bulk = require("../models/bulk");
const Lot = require("../models/lot");
const Supplier = require("../models/supplier");
const DifferenceReport = require("../models/difference_report");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

exports.getDreports = async (req, res, next) => {
    try {
        const allDreports = await DifferenceReport.findAll();
        res.status(200).json({
            dreports: allDreports,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createDreport = async (req, res, next) => {
    const reportId = req.body.report_id;
    const BulkId = req.body.bulk_id;
    const sup_id = req.body.supplier_id;

    try {
        await DifferenceReport.create({
            report_id: reportId,
            BulkBulkId: BulkId,
            supplier_id: sup_id,
            date: new Date()
        });

        console.log("Difference Report saved");
        res.status(200).json({
            differenceReport: "saved",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateDreport = async (req, res, next) => {
    // const bulk_id = req.body.bulkId;
    // const original_weight = req.body.originalWeight;
    // const remeasuring_weight = req.body.remeasuringWeight;
    const dateT = new Date();
    let date = ("0" + dateT.getDate()).slice(-2);
    // current month
    let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
    // current year
    let year = dateT.getFullYear();
    const dateString = year + "-" + month + "-" + date;
    try {

        const re_sup_bulk_id = await Bulk.findAll(
            {
                attributes: ['SupplierSupplierId', 'bulk_id'], //{[1,11], [2,12], [3,13]}
                where: {
                    method: 'Remeasuring',
                    date: dateString
                },
            });

        // console.log("Remeasuring supplier id bulk id array");
        // console.log(re_sup_bulk_id);

        const original_sup_bulk_id = await Bulk.findAll(
            {
                attributes: ['SupplierSupplierId', 'bulk_id'], //{[1,21], [2,22], [3,23]}
                where: {
                    method: 'AgentOriginal',
                    date: dateString,
                },
            });

        // console.log("Original supplier id bulk id array");
        // console.log(original_sup_bulk_id);

        let remeasured_bulk_weight = 0;
        let original_bulk_weight = 0;

        for (const bulk_id_ele of re_sup_bulk_id) {
            remeasured_bulk_weight = await Lot.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('gross_weight')), 'total_remeasured_weight'],
                ],
                group: ['BulkBulkId'],
                where: {
                    BulkBulkId: bulk_id_ele.dataValues.bulk_id,
                }
            });
            // console.log('bulk id of remeasured weight');
            // console.log(bulk_id_ele.dataValues.bulk_id);
            //
            // console.log('Remeasured bulk weight');
            // console.log(remeasured_bulk_weight[0].dataValues.total_remeasured_weight);
            await DifferenceReport.update(
                {
                    remeasuring_weight: remeasured_bulk_weight[0].dataValues.total_remeasured_weight,
                },
                {
                    where: {
                        BulkBulkId: bulk_id_ele.dataValues.bulk_id,
                    },
                }
            );
        }


        console.log("remeasured_bulk_weight");
        console.log(remeasured_bulk_weight);

        for (const bulk_id_ele of original_sup_bulk_id) {
            original_bulk_weight = await Lot.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('gross_weight')), 'total_original_weight'],
                ],
                group: ['BulkBulkId'],
                where: {
                    BulkBulkId: bulk_id_ele.dataValues.bulk_id,
                }
            });
            // console.log(original_bulk_weight);
            //console.log(original_bulk_weight[0].dataValues.total_original_weight);

            //console.log("bulk id");
            //console.log(bulk_id_ele.dataValues.bulk_id);

            let count = 0;
            let remeasured_bulk_id = 0;
            for (const index of re_sup_bulk_id) {
                if (index.dataValues.SupplierSupplierId === bulk_id_ele.dataValues.SupplierSupplierId) {
                    remeasured_bulk_id = count;
                } else {
                    count++;
                }
            }

            // console.log('bulk id of updating original weight');
            // console.log(re_sup_bulk_id[0].dataValues.bulk_id);
            // console.log('original weight');
            // console.log(original_bulk_weight[0].dataValues.total_original_weight);
            await DifferenceReport.update(
                {
                    original_weight: original_bulk_weight[0].dataValues.total_original_weight,
                    // original_weight: 121,
                },
                {
                    where: {
                        BulkBulkId: re_sup_bulk_id[remeasured_bulk_id].dataValues.bulk_id,
                        // BulkBulkId: 26073492,
                        // BulkBulkId: bulk_id_ele.dataValues.bulk_id,//Methandi enne 21, e kiyanne supplier 1 ge agent oririginal bulk id, e unata apita ona supplier is 1 wena remeasured bulk id eka, nathahoth bulk id 11
                    },
                }
            );
            // let remeasured_original_bulk_weight_get = 0;

            const remeasured_original_bulk_weight_get = await DifferenceReport.findAll({
                attributes: [
                    'original_weight',
                    'remeasuring_weight'
                ],
                where: {
                    BulkBulkId: re_sup_bulk_id[remeasured_bulk_id].dataValues.bulk_id,
                }
            });

            // let weight_diff = 0;

            let weight_diff = remeasured_original_bulk_weight_get[0].original_weight - remeasured_original_bulk_weight_get[0].remeasuring_weight;

            await DifferenceReport.update(
                {
                    weight_difference: weight_diff,
                    // original_weight: 121,
                },
                {
                    where: {
                        BulkBulkId: re_sup_bulk_id[remeasured_bulk_id].dataValues.bulk_id,
                        // BulkBulkId: 26073492,
                        // BulkBulkId: bulk_id_ele.dataValues.bulk_id,//Methandi enne 21, e kiyanne supplier 1 ge agent oririginal bulk id, e unata apita ona supplier is 1 wena remeasured bulk id eka, nathahoth bulk id 11
                    },
                }
            );

        }


        console.log("original_bulk_weight");
        console.log(original_bulk_weight);


        // const weight_differnce = (remeasured_bulk_weight - original_bulk_weight);
        //
        // await DifferenceReport.update(
        //     {
        //         original_weight: original_bulk_weight,
        //         remeasuring_weight: remeasured_bulk_weight,
        //         weight_differnce: weight_differnce,
        //     },
        //     {
        //         where: {
        //             BulkBulkId: bulk_id,
        //         },
        //     }
        // );
        console.log("Difference Report updated");
        res.status(200).json({
            differenceReport: "updated",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getDreportsForReporting = async (req, res, next) => {
    let agentID = [];
    let officerID = [];
    let allDreports = [];
    let totalDreports = [];
    let dReport = {};
    let dReportArray = [];
    try {
        for (let i = 0; i < 7; i++) { // i < 7
            allDreports = await DifferenceReport.findAll({
                attributes: ['report_id', 'original_weight', 'remeasuring_weight', 'weight_difference', 'supplier_id', 'date', 'BulkBulkId'],
                where: {
                    date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000), // This date should be today
                }
            });
            // console.log(allDreports);
            for (const bulk_id_ele of allDreports) {
                const allSuppliers = await Supplier.findAll({
                    attributes: ['name'],
                    where: {
                        supplier_id: bulk_id_ele.dataValues.supplier_id
                    }
                });

                officerID = await Bulk.findAll(
                    {
                        attributes: ['UserUserId', 'SupplierSupplierId'],
                        where: {
                            bulk_id: bulk_id_ele.dataValues.BulkBulkId
                        },
                    });

                for (const user_id_ele of officerID) {
                    agentID = await Bulk.findAll(
                        {
                            attributes: ['UserUserId', 'SupplierSupplierId'],
                            where: {
                                SupplierSupplierId: user_id_ele.dataValues.SupplierSupplierId,
                                method: 'AgentOriginal',
                                date: new Date(new Date('2021-03-30') - i * 24 * 60 * 60 * 1000)
                            },
                        });
                    // console.log(agentID);
                    dReport = {
                        report_id: bulk_id_ele.dataValues.report_id,
                        date: bulk_id_ele.dataValues.date,
                        original_weight: bulk_id_ele.dataValues.original_weight,
                        remeasuring_weight: bulk_id_ele.dataValues.remeasuring_weight,
                        weight_difference: bulk_id_ele.dataValues.weight_difference,
                        supplier_id: bulk_id_ele.dataValues.supplier_id,
                        supplier_name: allSuppliers[0].dataValues.name,
                        officer_id: user_id_ele.dataValues.UserUserId,
                        agent_id: agentID[0].dataValues.UserUserId
                    }
                    dReportArray.push(dReport);
                }
            }
        }
        res.status(200).json({
            dreports: dReportArray,
        });
    } catch
    (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};