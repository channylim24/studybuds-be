const express = require('express');

const {
    retrieveAllEvent,
    retrieveDetailEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/events');

const { eventValidator } = require('../middlewares/validators/events');

const router = express.Router();

router.get('/', retrieveAllEvent);
router.get('/:id', retrieveDetailEvent);
router.post('/', eventValidator, createEvent);
router.put('/:id', eventValidator, updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;