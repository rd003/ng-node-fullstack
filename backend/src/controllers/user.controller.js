const { Users } = require('../config/database');
const bcrypt = require('bcrypt');

class UserController {
    async signup(req, res) {
        try {
            // console.log(`====> req.body: ${JSON.stringify(req.body)}`);
            // whether user exists
            const user = await Users.findOne({
                where: { email: req.body.email }
            });
            // console.log(`====>user: ${JSON.stringify(user)}`);
            if (user) {
                return res.status(409).json({
                    statusCode: 409,
                    message: "User already exists"
                });
            }

            // create new user
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

            await Users.create({
                Email: req.body.email,
                PasswordHash: passwordHash,
                Role: "user"
            });
            return res.status(201).send({
                statusCode: 201,
                message: "User is created"
            });
        }
        catch (error) {
            console.log(`❌=====>${error}`);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    async login(req, res) {
        try {
            const user = await Users.findOne({ where: { email: req.username } });
            console.log(`======> user: ${JSON.stringify(user)}`);
            if (user === null) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Invalid username or password'
                });
            }

            const isMatch = await bcrypt.compare(req.password, hash);

            if (!isMatch) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Invalid username or password'
                });
            }

            res.json({
                "access_token": "some_token"
            })
        }
        catch (error) {
            console.log(`=====> ${error}`);
        }
    }
}

module.exports = new UserController();