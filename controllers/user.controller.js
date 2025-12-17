const { USER_ROLE } = require("../constants/userConstants");
const User = require("../models/user.model");
const { hashPassword } = require("../utils/password.util");
const { sanitizeUsers } = require("../utils/user.util");

exports.getAllusers = async (req, res) => {
  const userType = req.query.userType;
  const userStatus = req.query.userStatus;

  const queryObj = {};
  if (userType) queryObj.userType = userType.toLowerCase();
  if (userStatus) queryObj.userStatus = userStatus.toUpperCase();

  const users = await User.find(queryObj);

  return res.status(200).json(sanitizeUsers(users));
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  const users = await User.find({ userId });
  if (!users || users.length < 2)
    return res.status(400).json({ message: "user with given id not found" });

  res.status(200).json(sanitizeUsers(users));
};

exports.updateUserById = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId required" });
  }

  const user = await User.findOne({ userId: userId });
  if (!user) {
    return res
      .status(200)
      .json({ message: "user not found with given userId" });
  }

  // user can't update other user's profile
  if (user.userType != USER_ROLE.ADMIN && user.userId != userId) {
    return res.status(403).json({ message: "can't update other user" });
  }

  let updateUser = {
    name: req.body.name ?? user.name,
    password: req.body.password
      ? await hashPassword(req.body.password)
      : user.password,
    email: req.body.email ?? user.email,
  };

  if (req.userId === USER_ROLE.ADMIN) {
    updateUser.userStatus = req.body.userStatus ?? user.userStatus;
    updateUser.userType = req.body.userType ?? user.userType;
  }

  const updatedUser = await User.updateOne({ userId }, updateUser);

  res.status(200).json({ message: "user updated successfully", updatedUser });
};
