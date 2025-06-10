const { Sequelize } = require('../config/database');

class PersonController {

    getAllPeople = async (req, res) => {
        try {
            const [people] = await Sequelize.query("select Id,FirstName,LastName from People");
            res.json(people);
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
            const people = await Sequelize.query("select Id,FirstName,LastName from People where Id=?", {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT
            });
            if (people.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Person does not found"
                })
            }
            res.json(people[0]);
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
            const sql = `insert into People (FirstName,LastName)
        values (?,?); select SCOPE_IDENTITY() as id;`;
            const [result] = await Sequelize.query(sql, {
                replacements: [req.body.firstName, req.body.lastName],
                type: Sequelize.QueryTypes.INSERT
            });

            const createdPerson = { id: result[0].id, ...req.body };
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
            const [result] = await Sequelize.query(`
                 select 
                 case when exists(select 1 from People where Id=?) 
                 then 1 
                 else 0 end as personExists
                `, {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT
            });
            if (!result.personExists) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Person does not found."
                });
            }
            await Sequelize.query(`update People set FirstName=?, LastName=?
                 where Id=?`, {
                replacements: [req.body.firstName, req.body.lastName, req.params.id],
                type: Sequelize.QueryTypes.UPDATE
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

    deletePerson = async (req, res) => {
        try {
            const sql = `select 
            case when exists (
            select 1 from People where Id=?
            ) then 1 else 0 end as personExists`;

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

            await Sequelize.query(`delete from People where Id=?`, {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.DELETE
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