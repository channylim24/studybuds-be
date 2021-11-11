const express = require('express');

const { getAllEvent, getDetailEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = express.Router();

router.get('/', getAllEvent);
router.get('/:id', getDetailEvent);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;