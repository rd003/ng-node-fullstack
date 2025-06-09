const express = require('express');
const { Person } = require('../config/database');
const router = express.Router();
const { validatePerson, validatePersonUpdate } = require('../middleware/validation');


router.get("/", async (req, res) => {
    try {
        const people = await Person.findAll();
        res.json(people);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const person = await Person.findByPk(req.params.id);
        if (!person) {
            res.status(404).json({
                statusCode: 404,
                message: "Person does not found"
            })
        }
        res.json(person);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
});

router.post("/", validatePerson, async (req, res) => {
    try {
        const personData = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName
        };
        var createdPerson = await Person.create(personData);
        res.status(201)
            .json(createdPerson);
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                statusCode: 500,
                message: "Internal server error"
            });
    }
});

router.put("/:id", validatePersonUpdate, async (req, res) => {
    try {
        const existingPerson = await Person.findByPk(req.params.id);

        if (!existingPerson) {
            res.status(404).json({
                statusCode: 404,
                message: "Person does not found."
            });
        }

        const personToUpdate = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName
        };

        await Person.update(personToUpdate, {
            where: {
                Id: req.params.id
            }
        });

        res.status(204).send();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const person = await Person.findByPk(id);
        if (!person) {
            res.status(404).json({
                statusCode: 404,
                message: "Person not found"
            });
        }

        await Person.destroy({
            where: {
                Id: id
            }
        })

        res.status(204).send();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
});

module.exports = router;