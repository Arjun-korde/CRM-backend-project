const mongoose = require("mongoose");
const { USER_ROLE, USER_STATUS } = require("../constants/userConstants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minLength: 10,
    },
    userType: {
      type: String,
      enum: [USER_ROLE.CUSTOMER, USER_ROLE.ADMIN, USER_ROLE.ENGINEER],
      required: true,
      default: USER_ROLE.CUSTOMER,
    },
    userStatus: {
      type: String,
      enum: [USER_STATUS.APPROVED, USER_STATUS.PENDING, USER_STATUS.BLOCKED],
      required: true,
      default: USER_STATUS.APPROVED,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
