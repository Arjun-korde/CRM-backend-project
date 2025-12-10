// Imports
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
require('dotenv').config();

exports.signup = async (req, res) => {

    let userStatus = req.body.userStatus;

    if (!req.body.userType || !req.body.userType == 'CUSTOMER') {
        userStatus = "APPROVED";
    } else {
        userStatus = "PENDING";
    }

    // to store the user the in the DB
    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, Number(process.env.SALT_ROUNDS)),
        userStatus: userStatus
    };

    try {

        const userCreated = await User.create(userObj);
        const responce = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus
        }

        res.status(201).json({ responce });

    } catch (err) {
        console.log("error while creating user", err);
        return res.status(500).json({ message: "Something went wrong while creating user" })
    }


}