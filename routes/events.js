const express = require('express');

const { retrieveAllEvent, retrieveDetailEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const {
    isLogged
} = require('../middlewares/auth')


const router = express.Router();

router.get('/', isLogged, retrieveAllEvent);
router.get('/:id', isLogged, retrieveDetailEvent);
router.post('/', isLogged, createEvent);
router.put('/:id', isLogged, updateEvent);
router.delete('/:id', isLogged, deleteEvent);

module.exports = router;