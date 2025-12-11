// utils/token.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES_IN
    });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
}

function verifyToken(token, secret) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.log("erro while verifying the jwt token", err);
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
};
