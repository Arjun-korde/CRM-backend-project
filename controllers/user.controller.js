const User = require("../models/user.model");
const { sanitizeUsers } = require("../utils/user.util");


exports.getAllusers = async (req, res) => {
    const users = await User.find();

    return res.status(200).json(sanitizeUsers(users));
}