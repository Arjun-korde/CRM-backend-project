const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/auth/signup', authController.signup);
router.get('/', (req, res) => {
    res.json({message: `Welcome to ${req.path}`})
});

module.exports = router;