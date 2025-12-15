const { verifyToken } = require("../utils/token.util");
require('dotenv').config();

const validateToken = (req, res, next) => {

    const authHeader = req.get('authorization') || req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "MESSAGES.AUTH.TOKEN_MISSING" });
    }

    const token = authHeader.slice(7).trim();
    
    if (!token) {
        throw new Error('Missing access token');
    }

    const payload = verifyToken(token, process.env.JWT_SECRET);
    if(!payload) {
        throw new Error('Invalid token');
    }

    req.userId = payload.userId;
    req.userRole = payload.userType;

    next();

}

module.exports = {
    validateToken,

}