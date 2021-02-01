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
    const {supplier_id, name, type, telephone_no, address, status} = req.body;
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

exports.updateSupplier = async (req, res, next) => {
    const {supplier_id, name, status, telephone_no, address} = req.body;
    // console.log(user_id);

    try {
        await Supplier.update(
            {
                supplier_id,
                name,
                status,
                telephone_no,
                address
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