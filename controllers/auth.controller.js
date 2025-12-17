// Imports statments
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/token.util");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { USER_ROLE, USER_STATUS } = require("../constants/userConstants");

require("dotenv").config();

exports.signup = async (req, res) => {
  let userStatus = req.body.userStatus;

  if (!req.body.userType || req.body.userType == USER_ROLE.CUSTOMER) {
    userStatus = USER_STATUS.APPROVED;
  } else {
    userStatus = USER_STATUS.PENDING;
  }

  // to store the user the in the DB
  const userObj = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    userType: req.body.userType,
    password: await hashPassword(req.body.password),
    userStatus: userStatus,
  };

  try {
    const userCreated = await User.create(userObj);
    const responce = {
      name: userCreated.name,
      userId: userCreated.userId,
      email: userCreated.email,
      userType: userCreated.userType,
      userStatus: userCreated.userStatus,
    };

    res.status(201).json({ responce });
  } catch (err) {
    console.log("error while creating user", err);
    return res
      .status(500)
      .json({ message: "Something went wrong while creating user" });
  }
};

exports.signin = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: "userId and passwod required !" });
  }

  // check whether user exists or not
  const user = await User.findOne({ userId: userId });
  if (!user) {
    return res
      .status(400)
      .json({ message: "invalid userId or password (userId)!" });
  }

  switch (user.userStatus) {
    case USER_STATUS.PENDING:
      return res
        .status(400)
        .json({ message: "can't login since you're not approved yet" });
    case USER_STATUS.BLOCKED:
      return res
        .status(403)
        .json({ message: "can't login since you're blocked" });
  }

  // validate the password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "invalid userId or password (password)!" });
  }

  // issue jwt token
  const token = generateAccessToken({
    userId: user.userId,
    userType: user.userType,
  });

  res.status(200).json({
    name: user.name,
    userId: user.userId,
    userType: user.userType,
    userStatus: user.userStatus,
    accessToken: token,
  });
};
