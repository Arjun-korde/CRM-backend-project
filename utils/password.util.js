// utils/password.js
const bcrypt = require('bcrypt');

// Hash password
async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  return bcrypt.hash(plain, salt);
}

// Compare password
async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

module.exports = { hashPassword, comparePassword };
