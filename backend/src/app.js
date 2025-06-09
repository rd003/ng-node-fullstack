require("dotenv").config();
const routes = require('./routes');
const express = require("express");
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
module.exports = app;
