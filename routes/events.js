const express = require('express');

const { retrieveAllEvent, retrieveDetailEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = express.Router();

router.get('/', retrieveAllEvent);
router.get('/:id', retrieveDetailEvent);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;