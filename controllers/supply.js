const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Supplier = require('../models/supplier');
const Bulk = require('../models/bulk');
const Lot = require('../models/lot');
const User = require("../models/user");
const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");
const generator1 = aleaRNGFactory(2);

exports.getSuppliers = async (req, res, next) => {
    try {
        const allSuppliers = await Supplier.findAll();
        res.status(200).json({
            suppliers: allSuppliers,
        });
    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createSupplier = async (req, res, next) => {
    const {name, type, telephone_no, address, status, date_joined} = req.body;
    // console.log(supplier_id);
    console.log(name);
    console.log(type);
    try {
        switch (type) {
            case 'Grower Direct':
                await Supplier.create({
                    supplier_id: `GD${generator1.uInt32()}`,
                    name,
                    type,
                    telephone_no,
                    address,
                    status,
                    date_joined,
                    image: req.file === undefined ? null : req.file.path
                });
                break;
            case 'Grower through Agent':
                await Supplier.create({
                    supplier_id: `GA${generator1.uInt32()}`,
                    name,
                    type,
                    telephone_no,
                    address,
                    status,
                    date_joined,
                    image: req.file === undefined ? null : req.file.path
                });
                break;
            case 'Dealer':
                await Supplier.create({
                    supplier_id: `DL${generator1.uInt32()}`,
                    name,
                    type,
                    telephone_no,
                    address,
                    status,
                    date_joined,
                    image: req.file === undefined ? null : req.file.path
                });
                break;
            default:
                break;

        }
        console.log("Supplier saved");
        res.status(200).json({message: "Supplier created"});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getSupplier = async (req, res, next) => {
    const supplier_id = req.params.suppId;
    try {
        const allSupplier = await Supplier.findAll({where: {supplier_id}});
        res.status(200).json({
            supplier: allSupplier,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getSupplierInfoForReporting = async (req, res, next) => {
    const supplier_id = req.params.suppId;
    const time = req.params.time;
// console.log( getCurrDate(new Date()));
//     console.log( getDateMonthly());
    getDateMonthly();
//     const date = new Date();
//     const monthBefore =new Date(getCurrDate(getDateMonthly()));
//     console.log( date);
//     console.log(monthBefore);


    try {
        let gradeWiseTotalLots;
        let gradeWiseLotTotalArray = [];
        let lotWithDate = {};
        let date;
        let bulkID;
        switch (time) {
            case "Daily":
                bulkID = await Bulk.findAll({
                    attributes: ['bulk_id', 'date'],
                    where: {
                        SupplierSupplierId: supplier_id,
                        method: {[Op.notLike]: 'AgentOriginal'},
                        date: {[Op.between]: [new Date(new Date() - 30 * 24 * 60 * 60 * 1000), new Date()]}
                    }
                });
                // let bulkBydate = await Bulk.findAll({
                //     attributes: ['bulk_id', 'date'],
                //     where: {SupplierSupplierId: supplier_id, date:(sequelize.fn("month", sequelize.col("date")), 10) }
                // });
                // console.log(bulkBydate);
                break;
            case "Monthly":
                bulkID = await Bulk.findAll({
                    attributes: ['bulk_id', 'date'],
                    where: {
                        SupplierSupplierId: supplier_id,
                        method: {[Op.notLike]: 'AgentOriginal'},
                        date: {[Op.between]: [getDateMonthly(), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)]}
                    }
                });

                break;
            case "Yearly":
                bulkID = await Bulk.findAll({
                    attributes: ['bulk_id', 'date'],
                    where: {
                        SupplierSupplierId: supplier_id,
                        method: {[Op.notLike]: 'AgentOriginal'},
                        date: {[Op.between]: [getFullYear(), new Date(new Date().getFullYear(), 11, 31)]}
                    }
                });

                break;
            default:
                bulkID = await Bulk.findAll({
                    attributes: ['bulk_id', 'date'],
                    where: {
                        SupplierSupplierId: supplier_id,
                        method: {[Op.notLike]: 'AgentOriginal'},
                        date: {[Op.between]: [new Date(new Date() - 30 * 24 * 60 * 60 * 1000), new Date()]}
                    }
                });

        }
        // At Now, we didnt fetch details according to daily, monthly
        // console.log(bulkID);
        // console.log(bulkID[0].dataValues.bulk_id);
        // date = bulkID[0].dataValues.date;


        for (const bulk_id_ele of bulkID) {

            gradeWiseTotalLots = await Lot.findAll({
                attributes: ['grade_GL', [sequelize.fn('sum', sequelize.col('gross_weight')), 'total_Gross_weight'],],
                where: {BulkBulkId: bulk_id_ele.dataValues.bulk_id,},
                group: ['grade_GL']
//date:{$between: [dateString, endDate]
            });
            date = bulk_id_ele.dataValues.date;
            // console.log(gradeWiseTotalLots);
            for (let lots_ele of gradeWiseTotalLots) {
                // console.log(lots_ele.dataValues.grade_GL);


                lotWithDate[lots_ele.dataValues.grade_GL] = lots_ele.dataValues.total_Gross_weight;
                // console.log(lots_ele.dataValues.grade_GL +`+` +lots_ele.dataValues.total_Gross_weight);


                lotWithDate = {...lotWithDate, date};
                // console.log(lots_ele.dataValues);

                // lotWithDate = {...lotWithDate};
                // console.log(lotWithDate);
            }

            gradeWiseLotTotalArray.push(lotWithDate);
            lotWithDate = {};

        }
        // console.log(gradeWiseTotalLots);
        res.status(200).json({
            supplier: gradeWiseLotTotalArray,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getSupplierByName = async (req, res, next) => {
    const supplier_id = req.params.suppId;
    const name = req.params.supName;
    let allSupplier;

    try {
        if (supplier_id === 'null') {
            allSupplier = await Supplier.findAll({where: {name}});
        } else {
            allSupplier = await Supplier.findAll({where: {supplier_id}});
        }
        res.status(200).json({
            supplier: allSupplier,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.getAgentSupplierInfoForReporting = async (req, res, next) => {

    let allUsers;
    let bulkID;
    let allSupplier;
    let bulkWiseTotalLots;
    try {
        bulkID = await Bulk.findAll({
            attributes: ['bulk_id', 'date', 'UserUserId', 'SupplierSupplierId'],
            where: {
                method: {[Op.like]: 'AgentOriginal'},
                date: {[Op.between]: [new Date(new Date() - 7 * 24 * 60 * 60 * 1000), new Date()]}
            }
        });
        for (const bulk_id_ele of bulkID) {
            allUsers = await User.findAll({where: {user_id: bulk_id_ele.dataValues.UserUserId}});
            // bulk_id_ele.dataValues.userName = allUsers[0].dataValues.name;
            allSupplier = await Supplier.findAll({where: {supplier_id: bulk_id_ele.dataValues.SupplierSupplierId}});
            // bulk_id_ele.dataValues.userName = allUsers[0].dataValues.name;

            bulkWiseTotalLots = await Lot.findAll({
                attributes: ['grade_GL', 'gross_weight', 'no_of_container', 'water', 'course_leaf', 'other', 'net_weight', 'deduction', 'container_type', 'is_deleted'],
                where: {BulkBulkId: bulk_id_ele.dataValues.bulk_id,},
//date:{$between: [dateString, endDate]
            });
            for (const lot_ele of bulkWiseTotalLots) {
                lot_ele.dataValues.userId = bulk_id_ele.dataValues.UserUserId;
                lot_ele.dataValues.userName = allUsers[0].dataValues.name;
                lot_ele.dataValues.suppId=  bulk_id_ele.dataValues.SupplierSupplierId;
                lot_ele.dataValues.suppName = allSupplier[0].dataValues.name;

            }

        }


        res.status(200).json({
            suppliers: bulkWiseTotalLots,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.updateSupplier = async (req, res, next) => {
    const {supplier_id, name, status, telephone_no, address, date_joined, image} = req.body;
    console.log(supplier_id);

    try {
        await Supplier.update(
            {
                // supplier_id,
                name,
                status,
                telephone_no,
                address,
                date_joined,
                image: req.file === undefined ? image : req.file.path
            },
            {
                where: {
                    supplier_id
                },
            }
        );
        res.status(200).json({
            message: "ok",
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteSupplier = async (req, res, next) => {
    const supplier_id = req.params.suppId;

    let supplier = await Supplier.destroy({where: {supplier_id}}).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    if (!supplier) {
        console.log("supplier not found");
        res.status(500).json({message: "supplier not found"});
    } else {
        res.status(200).json({
            user: "Deleted",
        });
    }
};

exports.getSuppliersuntiltoday = async (req, res, next) => {
    let supplierCount = 0;
    try {
        const allSuppliers = await Supplier.findAll();

        for (let supplier of allSuppliers) {
            supplierCount = supplierCount + 1;
        }

        res.status(200).json({
            suppliers: supplierCount,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// const getCurrDate = ( dateObject)=>{
//     const dateT = dateObject;
//     // console.log(dateT);
//     let date = ("0" + dateT.getDate()).slice(-2);
//     // current month
//     let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
//     // current year
//     let year = dateT.getFullYear();
//     return year + "-" + month + "-" + date;
//     // console.log(new Date(new Date(dateT) - 30*24 * 60 * 60 * 1000));
//     // const dateBefore30 =new Date(new Date(dateT) - 30*24 * 60 * 60 * 1000);
// }
const getDateMonthly = () => {
    // const dateT = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    // // console.log(dateT);
    // let date = ("0" + dateT.getDate()).slice(-2);
    // // current month
    // let month = ("0" + (dateT.getMonth() + 1)).slice(-2);
    // // current year
    // let year = dateT.getFullYear();
    // const dateString= year + "-" + month + "-" + date;
    // // console.log(new Date(new Date(dateT) - 30*24 * 60 * 60 * 1000));
    // return dateString;
    let d = new Date();
    d.setMonth(d.getMonth() - 11);
    // console.log('d='+d);
    // let date = new Date();
    // let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // console.log(firstDay);
    // let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // console.log(lastDay);

    return new Date(d.getFullYear(), d.getMonth(), 1);
}
const getFullYear = () => {

    let d = new Date();
    d.setFullYear(d.getFullYear() - 3);


    console.log(new Date(d.getFullYear(), 0, 1));
    return new Date(d.getFullYear(), 0, 1);
}