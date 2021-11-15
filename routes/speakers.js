const express = require('express');
const {
    createSpeakerValidator,
} = require('../middlewares/validators/speakers')
const {
    isLogged
} = require('../middlewares/auth')
const {
    createSpeaker,
    allSpeaker,
    detailSpeaker,
    updateSpeaker,
    deleteSpeaker
} = require('../controllers/speakers')

const router = express.Router();

// routes
router
.route('/')
.get(isLogged, allSpeaker)
.post(isLogged, createSpeakerValidator, createSpeaker)

router
.route('/:id')
.get(isLogged, detailSpeaker)
.put(isLogged, createSpeakerValidator, updateSpeaker)
.delete(isLogged, deleteSpeaker)
// export
module.exports = router;