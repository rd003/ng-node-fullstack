const { Sequelize } = require('sequelize');
require('dotenv').config();
const personModel = require('../models/Person')

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 1433,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true, // For local development
            }
        }
    }
);

const db = {};
db.Sequelize = sequelize;
db.Person = personModel(sequelize);


module.exports = db;