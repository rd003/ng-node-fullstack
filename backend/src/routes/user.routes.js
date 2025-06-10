const express = require("express");
const { signup } = require("../controllers/user.controller");
const { validateUser } = require("../middleware/user.validator");

router = express.Router();

router.post('/signup', validateUser, signup);

module.exports = router;