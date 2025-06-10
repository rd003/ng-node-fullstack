const express = require('express');
const router = express.Router();
const { validatePerson, validatePersonUpdate } = require('../middleware/validation');
const { getAllPeople, getPersonById, createPerson, updatePerson, deletePerson } = require('../controllers/personController');

router.get('/', getAllPeople);
router.get('/:id', getPersonById);
router.post('/', validatePerson, createPerson);
router.put('/:id', validatePersonUpdate, updatePerson);
router.delete('/:id', deletePerson);

module.exports = router;