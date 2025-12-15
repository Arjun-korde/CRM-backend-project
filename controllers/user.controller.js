const User = require("../models/user.model");
const { sanitizeUsers } = require("../utils/user.util");


exports.getAllusers = async (req, res) => {
    const userType = req.query.userType
    const userStatus = req.query.userStatus;

    const queryObj = {};
    if(userType) queryObj.userType = userType.toLowerCase();
    if(userStatus) queryObj.userStatus = userStatus.toUpperCase();

    const users = await User.find(queryObj);

    return res.status(200).json(sanitizeUsers(users));
}