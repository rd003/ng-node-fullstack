const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'mil', 'int', 'co', 'io', 'me', 'info', 'biz'] } })
        .min(5)
        .max(100)
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.min': 'Email must be at least 5 characters long',
            'string.max': 'Email must not exceed 100 characters',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(8)
        .max(70)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must not exceed 70 characters',
            'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)',
            'any.required': 'Password is required'
        })
});

const loginSchema = Joi.object({
    username: Joi.string()
        .min(1)
        .max(100)
        .required(),
    password: Joi.string()
        .min(1)
        .max(70)
        .required()
});



const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        res.status(400)
            .json({
                statusCode: 400,
                message: "Validation failed",
                errors: error.details.map(detail => detail.message)
            });
    }
    next();
}

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        res.status(400)
            .json({
                statusCode: 400,
                message: "Validation failed",
                errors: error.details.map(detail => detail.message)
            });
    }
    next();
}
module.exports = {
    validateUser,
    validateLogin
}