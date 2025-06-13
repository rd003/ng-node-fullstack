const { Sequelize } = require('../config/database');

class PersonController {

    getAllPeople = async (req, res) => {
        try {
            const [people] = await Sequelize.query("EXEC spGetPeople");
            // Just converting every property in camelCase, because I have messed up in front end
            const updatedPersonList = people.map(p => ({ id: p.Id, firstName: p.FirstName, lastName: p.LastName }));
            res.json(updatedPersonList);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    getPersonById = async (req, res) => {
        try {
            const result = await Sequelize.query("exec spGetPersonById @Id=?", {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT
            });

            if (result.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Person does not found"
                })
            }

            const createdPerson = {
                id: result[0].Id,
                firstName: result[0].FirstName,
                lastName: result[0].LastName
            }
            res.json(createdPerson);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    createPerson = async (req, res) => {
        try {
            const sql = `exec spCreatePerson @FirstName=?,@LastName=?`;
            const [result] = await Sequelize.query(sql, {
                replacements: [req.body.firstName, req.body.lastName],
                type: Sequelize.QueryTypes.SELECT
            });
            // console.log("====>" + JSON.stringify(result));
            const createdPerson = { id: result.id, ...req.body };
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
    }

    updatePerson = async (req, res) => {
        try {
            const [result] = await Sequelize.query('exec spIsPersonExists @Id=?', {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT
            });
            if (!result.personExists) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Person does not found."
                });
            }
            await Sequelize.query(`exec spUpdatePerson @Id=?,@FirstName=?,@LastName=?`, {
                replacements: [req.params.id, req.body.firstName, req.body.lastName],
                type: Sequelize.QueryTypes.SELECT
            });
            // Just converting every property in camelCase, because I have messed up in front end
            res.status(204).send();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal server error"
            });
        }
    }

    deletePerson = async (req, res) => {
        try {
            const sql = 'exec spIsPersonExists @Id=?';

            const [result] = await Sequelize.query(sql, {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT
            });
            if (!result.personExists) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Person not found"
                });
            }

            await Sequelize.query(`exec spDeletePerson @Id=?`, {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT
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
    }
}

module.exports = new PersonController();