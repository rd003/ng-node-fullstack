const { Users } = require('../config/database');
const bcrypt = require('bcrypt');
const { convertToMilliseconds } = require('../utils/time.util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use a strong secret in production
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';


const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
}

// Generate token pair
const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    const refreshToken = generateRefreshToken();

    return { accessToken, refreshToken };
}

const signup = async (req, res) => {
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

        res.status(201).send({
            statusCode: 201,
            message: "User is created"
        });
    }
    catch (error) {
        console.log(`❌=====>${error}`);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
}

const login = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { email: req.body.username } });
        //  console.log(`======> user: ${JSON.stringify(user)}`);
        if (user === null) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid username or password'
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid username or password'
            });
        }

        const payload = {
            username: user.Email,
            role: user.Role
        };

        const { accessToken, refreshToken } = generateTokens(payload);

        // save refresh token to db

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = new Date(Date.now() + convertToMilliseconds(REFRESH_EXPIRY));
        user.save();

        // set token in cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // set true for production
            maxAge: convertToMilliseconds(JWT_EXPIRES_IN)
        }

        res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                "accessToken": accessToken,
                "refreshToken": refreshToken
            })
    }
    catch (error) {
        console.log(`❌=====>${error}`);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
}

// logout 
const logout = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // set true for production
        }

        // TODO: remove refresh token from User's table
        // How do I get user.Email or id. 
        // JWT payload `username` contains `email`
        // we have set req.User in authentication middleware, let's check is it available? Since this route is protected

        res.status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json({
                "accessToken": accessToken
            });
    } catch (error) {
        console.log(`❌=====>${error}`);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
}

const refreshAccessToken = (req, res) => {

}

module.exports = {
    signup,
    login,
    logout,
    refreshAccessToken
};