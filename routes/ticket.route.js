const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/tickets',
  authMiddleware.validateToken,
  ticketController.createTicket
);

module.exports = router;
