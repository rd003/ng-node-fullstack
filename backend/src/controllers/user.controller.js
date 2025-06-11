const { Users } = require('../config/database');
const bcrypt = require('bcrypt');
const { convertToMilliseconds } = require('../utils/time.util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { where } = require('sequelize');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use a strong secret in production
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';


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

        // since these api can be access by mobile app too, where cookies don't work, so we need to send tokens as a response too.
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
                "statusCode": 200,
                "message": "You are successfully logged out"
            });
    } catch (error) {
        console.log(`❌=====>${error}`);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
}

// generaing access tokens without login
const refreshAccessToken = async (req, res) => {
    try {
        const existingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!existingRefreshToken) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Refresh token not provided'
            });
        }

        // find user
        // TODO: thre should be a better way to find a user. Is it a common practice in node js? 

        const user = await Users.findOne({
            where: {
                RefreshToken: existingRefreshToken
            }
        });

        // if user is not exists (enters wrong refresh token) or token is expired
        if (!user || user?.RefreshTokenExpiry < Date.now()) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Refresh token is expired, so you must logged in'
            });
        }

        // else generate new access token and refresh token

        const { accessToken, refreshToken } = generateTokens({
            username: user.Email,
            role: user.Role
        });

        // set tokens in cookie and also return them in response
        res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                "accessToken": accessToken,
                "refreshToken": refreshToken
            })


    } catch (error) {
        console.log(`❌=====>${error}`);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
}

module.exports = {
    signup,
    login,
    logout,
    refreshAccessToken
};