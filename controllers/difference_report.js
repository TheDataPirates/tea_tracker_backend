const Bulk = require("../models/bulk");
const Lot = require("../models/lot");
const Supplier = require("../models/supplier");
const DifferenceReport = require("../models/difference_report");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

exports.getDreports = async (req, res, next) => {
    try {
      const allDreports = await Difference_Report.findAll();
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

    try {
      await DifferenceReport.create({
        report_id: reportId,
        BulkBulkId: BulkId,
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

        const re_sup_bulk_id = await Bulk.findAll({
            attributes: ['SupplierSupplierId', 'bulk_id'] //{[1,11], [2,12], [3,13]}
          },
          {
            where: {
                method: 'Remeasuring',
                date: dateString
            },
          });

          console.log("Remeasuring supplier id bulk id array");
          console.log(re_sup_bulk_id);

          const original_sup_bulk_id = await Bulk.findAll({
            attributes: ['SupplierSupplierId', 'bulk_id'] //{[1,21], [2,22], [3,23]}
          },
          {
            where: {
                method: 'AgentOriginal',
                date: dateString,
            },
          });

          console.log("Original supplier id bulk id array");
          console.log(original_sup_bulk_id);

          let remeasured_bulk_weight = 0;
          let original_bulk_weight = 0;

          re_sup_bulk_id.forEach(async (bulk_id_ele) => {
              remeasured_bulk_weight =  await Lot.findAll({
                attributes: [
                  [sequelize.fn('sum', sequelize.col('gross_weight'))],
                ],
                group: [bulk_id_ele.bulk_id],
              });
          });

          console.log("remeasured_bulk_weight");
          console.log(remeasured_bulk_weight);

          original_sup_bulk_id.forEach(async (bulk_id_ele) => {
            original_bulk_weight =  await Lot.findAll({
              attributes: [
                [sequelize.fn('sum', sequelize.col('gross_weight'))],
              ],
              group: [bulk_id_ele.bulk_id],
            });
        });

        console.log("original_bulk_weight");
        console.log(original_bulk_weight);
    
  
      const weight_differnce = ( remeasured_bulk_weight - original_bulk_weight);
  
      await DifferenceReport.update(
        {
          original_weight: original_bulk_weight,
          remeasuring_weight: remeasured_bulk_weight,
          weight_differnce: weight_differnce, 
        },
        {
          where: {
            BulkBulkId: bulk_id,
          },
        }
      );
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