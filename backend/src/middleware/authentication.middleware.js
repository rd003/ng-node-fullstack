const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    //console.log('auth-middleware======> Cookies received:', JSON.stringify(req.cookies));

    if (!token) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                statusCode: 403,
                message: 'Invalid or expired token'
            });
        }
        // console.log(`=====> JWT verified =>  req.user : ${JSON.stringify(user)} `);
        req.user = user;
    })
    next();
}

// Middleware to check specific roles
const requiredRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                statusCode: 403,
                message: 'Insufficient permissions'
            });
        }

        next();
    }
}

module.exports = {
    authenticateToken,
    requiredRoles
}

