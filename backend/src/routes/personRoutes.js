const express = require('express');
const router = express.Router();
const { validatePerson, validatePersonUpdate } = require('../middleware/validation');
const { getAllPeople, getPersonById, createPerson, updatePerson, deletePerson } = require('../controllers/personController');
const { authenticateToken, requiredRoles } = require('../middleware/authentication.middleware');

router.get('/', authenticateToken, getAllPeople);
router.get('/:id', authenticateToken, getPersonById);
router.post('/', authenticateToken, validatePerson, createPerson);
router.put('/:id', authenticateToken, validatePersonUpdate, updatePerson);
router.delete('/:id', authenticateToken, requiredRoles(['admin']), deletePerson);

module.exports = router;