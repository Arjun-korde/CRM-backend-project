const { model } = require("mongoose");
const { USER_TYPES } = require("../constants/userConstants");
const User = require("../models/user.model");

validateUserRequestBody = async (req, res, next) => {
    
    //validate the username
    if(!req.body.name) {
        return res.status(400).json({
            message: "Failed! Bad Request, name required"
        });
    }

    if(!req.body.userId) {
        return res.status(400).json({
            message: "userId required !"
        });
    }

    if(!req.body.email) {
        return res.status(400).json({
            message: "email required !"
        });
    }

    if(!req.body.password) {
        return  res.status(400).json({
            message: "password required !"
        });
    }

    const user = await User.findOne({userId: req.body.userId});

    if(user) {
        return res.status(400).json({
            message: "user with this userId already exist"
        });
    }

    const user_email = await User.findOne({ email: req.body.email });
    
    if(user_email) {
        return res.status(400).json({
            message: "user with this email already exist"
        });
    }

    const possibelUserTypes = [USER_TYPES.ADMIN, USER_TYPES.CUSTOMER, USER_TYPES.ENGINEER];

    if(!possibelUserTypes.includes(req.body.userType)) {
        return res.status(400).json({
            message: "invalid userType !"
        });
    }

    return next();
}

module.exports = {
    validateUserRequestBody
}