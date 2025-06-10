const express = require("express");
const { signup, login } = require("../controllers/user.controller");
const { validateUser, validateLogin } = require("../middleware/user.validator");

router = express.Router();

router.post('/signup', validateUser, signup);
router.post('/login', validateLogin, login);

module.exports = router;