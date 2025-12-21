const { USER_ROLE, USER_STATUS } = require('../constants/userConstants');
const User = require('../models/user.model');
const { hashPassword } = require('../utils/password.util');
const { sanitizeUsers, isValidEnumValue } = require('../utils/user.util');

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
    return res.status(400).json({ message: 'user with given id not found' });

  res.status(200).json(sanitizeUsers(users));
};

exports.updateUserById = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: 'userId required' });
  }

  // fetch user from the DB and check whether is exist or not
  const user = await User.findOne({ userId: userId });
  if (!user) {
    return res
      .status(200)
      .json({ message: 'user not found with given userId' });
  }

  // authorization
  const isAdmin = req.userRole === USER_ROLE.ADMIN;
  const isOwn = req.userId === userId;

  // user can't update other user's profile
  if (!isAdmin && !isOwn) {
    return res.status(403).json({ message: "can't update other user" });
  }

  let updateUser = {
    name: req.body.name ?? user.name,
    password: req.body.password
      ? await hashPassword(req.body.password)
      : user.password,
    email: req.body.email ?? user.email,
  };

  if (isAdmin) {
    const { userStatus, userType: role } = req.body;

    // validate userStatus value
    if (userStatus && !isValidEnumValue(userStatus, USER_STATUS)) {
      return res.status(400).json({
        message: `Invalid userStatus allowed only (${Object.values(
          USER_STATUS
        )})`,
      });
    }
    // now we can safely edit userStatus
    updateUser.userStatus = user.userStatus;

    //validate the role value
    if (role && !isValidEnumValue(role, USER_ROLE)) {
      return res.status(400).json({
        message: `Invalid userType allowed only (${Object.values(USER_ROLE)}) `,
      });
    }
    updateUser.userType = user.userType;
  }

  const updatedUser = await User.updateOne({ userId }, updateUser);

  res.status(200).json({ message: 'user updated successfully', updatedUser });
};
