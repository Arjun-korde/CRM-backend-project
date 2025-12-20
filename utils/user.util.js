const { sanitizeFilter } = require("mongoose");

// sanitize users, removes sensitive fields from the user object
sanitizeUsers = (users) => {
  let usersResult = [];

  users.forEach((user) => {
    usersResult.push({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  });

  return usersResult;
};

const isValidEnumValue = (value, enumObject) => {
  return Object.values(enumObject).includes(value.toLowerCase());
};

module.exports = {
  sanitizeFilter,
  isValidEnumValue,
};
