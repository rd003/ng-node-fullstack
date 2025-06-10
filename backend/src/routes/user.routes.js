const express = require("express");
const { signup } = require("../controllers/user.controller");

router = express.Router();

router.get('/signup', signup);

module.exports = router;