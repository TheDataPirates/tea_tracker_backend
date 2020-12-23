const Supplier = require('../models/supplier');

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
    const {supplier_id, name, type, telephone_no, address,status} = req.body;
    console.log(supplier_id);
    console.log(name);
    console.log(type);

    try {
        await Supplier.create({
            supplier_id,
            name,
            type,
            telephone_no,
            address,
            status
        });
        console.log("Supplier saved");
        res.status(200).json({message: "Supplier created"});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};