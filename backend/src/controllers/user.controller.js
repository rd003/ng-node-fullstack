const { Users } = require('../config/database');
const bcrypt = require('bcrypt');
const { convertToMilliseconds } = require('../utils/time.util');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use a strong secret in production

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';


const signup = async (req, res) => {
    try {
        // whether user exists
        const user = await Users.findOne({
            where: { email: req.body.email }
        });
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

const generateAccessAndRefreshTokens = (payload) => {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign({
        username: payload.username
    }, JWT_SECRET, {
        expiresIn: REFRESH_EXPIRY
    });

    return { accessToken, refreshToken };
}

const login = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { email: req.body.username } });
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

        // generate access and refresh tokens
        const payload = {
            username: user.Email,
            role: user.Role
        };
        const { accessToken, refreshToken } = generateAccessAndRefreshTokens(payload);

        // save refresh token to db
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = new Date(Date.now() + convertToMilliseconds(REFRESH_EXPIRY));
        user.save();

        // set token in cookie
        const jwtCookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: convertToMilliseconds(JWT_EXPIRES_IN),
            sameSite: 'strict'
        }

        const refreshTokenCookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: convertToMilliseconds(REFRESH_EXPIRY),
            path: '/api/auth/refresh', // Only sent to refresh endpoint
            sameSite: 'strict'
        }

        // since these api can be access by mobile app too, where cookies don't work, so we need to send tokens as a response too.
        res
            .status(200)
            .cookie("accessToken", accessToken, jwtCookieOptions)
            .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
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
        // removing refresh token from db

        // First we need to get username/email, which can be obtained from req.user, which has been set in authentication middleware. Since it is an authenticated route, so we can access req.user

        const username = req.user.username;

        const user = await Users.findOne({
            where: {
                Email: username
            }
        });

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        user.save();

        res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken", { path: '/api/auth/refresh' })
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
        const refreshTokenInReq = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshTokenInReq) {
            //console.log("===> Step 4: No refresh token, returning 401");
            return res.status(401).json({
                statusCode: 401,
                message: 'refreshToken is not provided'
            });
        }
        // return immediately if token is invalid
        let decodedRefreshToken;
        try {
            decodedRefreshToken = jwt.verify(refreshTokenInReq, JWT_SECRET);
        } catch (error) {
            console.log(`=====> ${error}`);
            return res.status(401).json({
                statusCode: 401,
                message: 'Invalid refresh token'
            });
        }

        console.log(`decoded refresh token: ${JSON.stringify(decodedRefreshToken)}`);
        const user = await Users.findOne({
            where: {
                Email: decodedRefreshToken.username
            }
        });

        // Check if refresh token is valid, not compromised and not expired
        if (!user || user.RefreshToken !== refreshTokenInReq || user.RefreshTokenExpiry < Date.now()) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Refresh token is invalid or expired.'
            });
        }

        // generate new access and refresh token
        const payload = {
            username: user.Email,
            role: user.Role
        };

        const { accessToken, refreshToken } = generateAccessAndRefreshTokens(payload);

        // Rotating the refresh token. In this way attacker have less time window to attack
        user.RefreshToken = refreshToken;
        user.save();

        // set tokens in cookie and also return them in response
        const jwtCookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: convertToMilliseconds(JWT_EXPIRES_IN),
            sameSite: 'strict'
        }

        // refresh token options

        // If we fetch maxAge from .env file on every refresh, our refreshToken cookie will never be expired.
        // We need to calculate the maxAge on the basis of refreshTokenExpiry in db
        const expiryDate = new Date(user.RefreshTokenExpiry);
        const currentDate = new Date();
        const remainingTimeMs = expiryDate - currentDate;

        const refreshTokenCookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: remainingTimeMs > 0 ? remainingTimeMs : 0,
            path: '/api/auth/refresh', // Only sent to refresh endpoint
            sameSite: 'strict'
        }

        console.log("====> new  refresh token has generated.");
        res
            .status(200)
            .cookie("accessToken", accessToken, jwtCookieOptions)
            .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
            .json({
                "accessToken": accessToken,
                "refreshToken": refreshToken
            });
    } catch (error) {
        console.log(`❌user.controller/refresh => catch=====>${error}`);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
}

const getUserInfo = async (req, res) => {
    try {
        const username = req.user.username;
        const user = await Users.findOne({
            attributes: [['Email', 'username'], ['Role', 'role']],
            where: {
                Email: username
            }
        });

        // It is unlikely to happen
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found"
            });
        }

        res.status(200).json(user);
    }
    catch (error) {
        console.log(`❌=====>${error}`);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
}

module.exports = {
    signup,
    login,
    logout,
    refreshAccessToken,
    getUserInfo
};
