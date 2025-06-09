const Joi = require('joi');

const personSchema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .max(30)
        .required(),
    lastName: Joi.string()
        .min(1)
        .max(30)
        .required()
});

const validatePerson = (req, res, next) => {
    const { error } = personSchema.validate(req.body);

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

const validatePersonUpdate = (req, res, next) => {
    const updateSchema = personSchema.fork(['firstName', 'lastName'], (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);

    if (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Validation failed",
            errors: error.details.map(d => d.message)
        });
    }
    next();
}

module.exports =
{
    validatePerson,
    validatePersonUpdate
};