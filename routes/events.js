const express = require('express');

const { retrieveAllEvent, retrieveDetailEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const {
    isLogged
} = require('../middlewares/auth')

const { eventValidator } = require('../middlewares/validators/events')

const router = express.Router();

router.get('/', isLogged, retrieveAllEvent);
router.get('/:id', isLogged, retrieveDetailEvent);
router.post('/', isLogged, eventValidator, createEvent);
router.put('/:id', isLogged, updateEvent);
router.delete('/:id', isLogged, deleteEvent);

module.exports = router;