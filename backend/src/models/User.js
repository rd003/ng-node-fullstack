const { DataTypes } = require('sequelize');

function userModel(sequelize) {
    const attributes = {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        Email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        PasswordHash: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    };

    const options = {
        freezeTableName: true,
        timestamps: false,
    };

    return sequelize.define("Users", attributes, options);
}

module.exports = userModel;