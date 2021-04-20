const Trough = require('../models/trough');
const Drier = require('../models/drier');
const Roller = require('../models/roller');
const Roll_Breaker = require('../models/roll_breaker');
const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");
const generator1 = aleaRNGFactory(10);


exports.getMachines = async (req, res, next) => {
    try {
        const allTroughs = await Trough.findAll();
        const allDriers = await Drier.findAll();
        const allRollers = await Roller.findAll();
        const allRoll_breaker = await Roll_Breaker.findAll();
        res.status(200).json({
            trough: allTroughs,
            driers: allDriers,
            rollers: allRollers,
            roll_breaker: allRoll_breaker
        });
    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
//
exports.createMachine = async (req, res, next) => {
    const {modal, machine_purchase_date, power_info, type,capacity,troughtype} = req.body;
    // console.log(machine_id);
    console.log(modal);

    console.log(type);
    try {
        switch (type) {
            case 'Drier':
                await Drier.create({
                   
                    drier_id:`DM${generator1.uInt32()}`,
                    modal,
                    machine_purchase_date,
                    power_info,
                    image: req.file.path
                });
                console.log("Drier saved");
                res.status(200).json({message: "Drier created"});
                break;
            case 'Roll Breaker' || 'RB':
                await Roll_Breaker.create({
                    roll_breaker_id: `RM${generator1.uInt32()}`,
                    modal,
                    machine_purchase_date,
                    power_info,
                    image: req.file.path
                });
                console.log("Roll Breaker saved");
                res.status(200).json({message: "Roll Breaker created"});
                break;

            case 'Roller':
                await Roller.create({
                    roller_id: `RM${generator1.uInt32()}`,
                    modal,
                    machine_purchase_date,
                    power_info,
                    image: req.file.path
                });
                console.log("Roller saved");
                res.status(200).json({message: "Roller created"});
                break;
            case'Trough':
                await Trough.create({
             trough_id: `TR${generator1.uInt32()}`,
              type: troughtype,
              capacity,
              image: req.file.path
           });
           console.log("Trough Saved");
           res.status(200).json({message: "Trough Created"});
           break;
default:
                const error = new Error("Machine type invalid !");
                error.statusCode = 422;
                next(error);
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getMachine = async (req, res, next) => {
    const {id, type} = req.query;
    console.log(id);
    console.log(type);
    try {
        switch (type) {
            case 'Drier':
                const allDriers = await Drier.findAll({attributes:[['drier_id','id'],'modal','machine_purchase_date','power_info'],where: {drier_id:id}});

                res.status(200).json({
                    machine: allDriers,
                });
                break;
            case 'Roll Breaker' || 'RB':
                const allRoll_breaker = await Roll_Breaker.findAll({attributes:[['roll_breaker_id','id'],'modal','machine_purchase_date','power_info'],where: {roll_breaker_id:id}});
                res.status(200).json({
                    machine: allRoll_breaker,
                });
                break;

            case 'Roller':
                const allRollers = await Roller.findAll({attributes:[['roller_id','id'],'modal','machine_purchase_date','power_info'],where: {roller_id:id}});
                res.status(200).json({
                    machine: allRollers,
                });
                break;
                case 'Trough':
                    const allTroughs = await Trough.findAll({attributes:[['trough_id','id'],'type','capacity'],where: {trough_id:id}});
    
                    res.status(200).json({
                        machine: allTroughs,
                    });
                    break;
            default:
                const error = new Error("Can not do edit in this time !");
                error.statusCode = 422;
                next(error);
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateMachine = async (req, res, next) => {
    // const {id, type} = req.query;
    const type = req.params.type;
    const {machine_id, modal, machine_purchase_date, power_info} = req.body;

    console.log(machine_id);

    try {
        switch (type) {
            case 'Drier':
            await Drier.update(
                {
                    drier_id: machine_id,
                    modal,
                    machine_purchase_date,
                    power_info,
                },
                {
                    where: {
                        drier_id: machine_id,
                    },
                }
            );
            res.status(200).json({
                message: "ok",
            });
            break;
        case 'Roll Breaker' || 'RB':
            await Roll_Breaker.update(
                {
                    roll_breaker_id: machine_id,
                    modal,
                    machine_purchase_date,
                    power_info,
                },
                {
                    where: {
                        roll_breaker_id: machine_id,
                    },
                }
            );
            res.status(200).json({
                message: "ok",
            });
            break;

        case 'Roller':
            await Roller.update(
                {
                    roller_id: machine_id,
                    modal,
                    machine_purchase_date,
                    power_info,
                },
                {
                    where: {
                        roller_id: machine_id,
                    },
                }
            );
            res.status(200).json({
                message: "ok",
            });
            break;
            case 'Trough':
                await Trough.update(
                    {
                        trough_id: machine_id,
                        type,
                        capacity,
                    },
                    {
                        where: {
                            trough_id: machine_id,
                        },
                    }
                );
                res.status(200).json({
                    message: "ok",
                });
                break;

        default:
            const error = new Error("Machine type invalid !");
            error.statusCode = 422;
            next(error);
    }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
//
exports.deleteMachine = async (req, res, next) => {
    const {id, type} = req.query;
    console.log(id);
    console.log(type);
    let machine;
    switch (type) {
        case 'Trough':
            machine = await Trough.destroy({ where: {  Trough_id: id, } }).catch((err) => {
               if (!err.statusCode) {
                   err.statusCode = 500;
               }
               next(err);
           });
           if (!machine) {
               console.log("Trough not found");
               res.status(500).json({ message: "Trough not found" });
           } else {
               res.status(200).json({
                   user: "Deleted",
               });
           }
           break;

        case 'Drier':
             machine = await Drier.destroy({ where: {  drier_id: id, } }).catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
            if (!machine) {
                console.log("Drier not found");
                res.status(500).json({ message: "Drier not found" });
            } else {
                res.status(200).json({
                    user: "Deleted",
                });
            }
            break;
        case 'Roll Breaker' || 'RB':
            machine = await Roll_Breaker.destroy({ where: {  roll_breaker_id: id, } }).catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
            if (!machine) {
                console.log("Roll Breaker not found");
                res.status(500).json({ message: "Roll Breaker not found" });
            } else {
                res.status(200).json({
                    machine: "Deleted",
                });
            }
            break;

        case 'Roller':
            machine = await Roller.destroy({ where: {  roller_id: id, } }).catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
            if (!machine) {
                console.log("Roller not found");
                res.status(500).json({ message: "Roller not found" });
            } else {
                res.status(200).json({
                    user: "Deleted",
                });
            }
            break;
        default:
            const error = new Error("Machine type invalid !");
            error.statusCode = 422;
            next(error);
    }

};