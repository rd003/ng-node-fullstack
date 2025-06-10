const { Users } = require('../config/database');
const bcrypt = require('bcrypt');

class UserController {
    async signup(req, res) {
        try {
            console.log(`====> ${req.body}`);
            const saltRounds = 10;
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                Users.create({
                    Email: req.body.email,
                    PasswordHash: hash
                });
            });
            res.status(201).send();
        }
        catch (error) {
            console.log(`❌=====>${error}`);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }


}

module.exports = new UserController();