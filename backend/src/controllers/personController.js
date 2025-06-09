const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const people = await db.Person.findAll();
        res.json(people);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            error: "Internal server error"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const person = await db.Person.findByPk(req.params.id);
        if (!person) {
            res.status(404).json({
                statusCode: 404,
                error: "Person does not found"
            })
        }
        res.json(person);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            error: "Internal server error"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const personData = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName
        };
        var createdPerson = await db.Person.create(personData);
        res.status(201)
            .json(createdPerson);
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                statusCode: 500,
                error: "Internal server error"
            });
    }
});

module.exports = router;