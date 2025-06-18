const { allow } = require('joi');
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
        },
        Role: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        RefreshToken: {
            type: DataTypes.STRING(400),
            allowNull: true
        },
        RefreshTokenExpiry: {
            type: DataTypes.DATE,
            allow: true
        }
    };

    const options = {
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['Email'],
                name: 'UIX_Email'
            }
        ]
    };

    return sequelize.define("Users", attributes, options);
}

module.exports = userModel;