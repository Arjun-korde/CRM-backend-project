const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateUserRequestBody } = require('../middlewares/validateUserReqBody');

router.post('/auth/signup', validateUserRequestBody, authController.signup);
router.post('/auth/signin', authController.signin);
router.get('/', (req, res) => {
  res.json({ message: `Welcome to ${req.path}` });
});

module.exports = router;
