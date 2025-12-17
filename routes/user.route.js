const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/rbacMiddleware");
const { USER_ROLE } = require("../constants/userConstants");

router.get(
  "/users",
  authMiddleware.validateToken,
  allowRoles(USER_ROLE.ADMIN),
  userController.getAllusers
);

router.get(
  "/users/:userId",
  authMiddleware.validateToken,
  userController.getUserById
);

router.put(
  "/users/:userId",
  authMiddleware.validateToken,
  userController.updateUserById
);

module.exports = router;
