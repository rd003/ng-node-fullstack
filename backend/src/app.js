require("dotenv").config();
const routes = require('./routes');
const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize } = require('./config/database');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const connectDb = async () => {
    try {
        await Sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        if (process.env.NODE_ENV !== 'production') {
            await Sequelize.sync({ alter: true });
            console.log('📊 Database models synchronized.');
        }
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}

connectDb();

module.exports = app;
