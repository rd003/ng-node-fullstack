const express = require("express");
const { signup, login, logout, refreshAccessToken, getUserInfo } = require("../controllers/user.controller");
const { validateUser, validateLogin } = require("../middleware/user.validator");
const { authenticateToken } = require("../middleware/authentication.middleware");

router = express.Router();

router.post('/signup', validateUser, signup);
router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getUserInfo)
router.post('/logout', authenticateToken, logout)
router.post('/refresh', refreshAccessToken)

module.exports = router;