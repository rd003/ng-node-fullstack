const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        FirstName: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
    };

    const options = {
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    };
    return sequelize.define("People", attributes, options);
}

module.exports = model;