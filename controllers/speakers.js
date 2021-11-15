const { speaker } = require('../models');

class Speaker {
    // creating speaker
    async createSpeaker(req, res, next) {
        try {
            // bikin speaker
            const newData = await speaker.create(req.body)
            // find speaker
            const data = await speaker.findOne({
                where: {
                    id: newData.id,
                },
                attributes: {exclude: ["updatedAt", "deletedAt"]}
            })

            res.status(200).json({ data });
        } catch (error) {
            console.log(error);
            res.status(500).json(['Error creating SPEAKER']);
        }
    }
    // show all speaker
    async allSpeaker(req, res, next) {
        try {
            const data = await speaker.findAll({
                attributes: {exclude: ["createdAt", "updatedAt", "deletedAt"]}
            })

            if(data.lengt === 0) {
                return res.status(404).json(['Speaker not found!'])
            }

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json(['Error getting all SPEAKER']);
        }
    }
    // show specific speaker
    async detailSpeaker(req, res, next) {
        try {
            const data = await speaker.findOne({
                where: {
                    id: req.params.id
                },
            });

            if (!data) {
            return res.status(404).json({ errors: ["Speaker not found"] });
            }

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json(['Error getting all SPEAKER']);
        }
    }
    // updating speaker
    async updateSpeaker(req, res, next) {
        try {
            const updateSpeaker = await speaker.update({
                where: { 
                    id: req.params.id
                },
                attributes: {exclude: ["createdAt", "updatedAt"]}
            })
            if(updateSpeaker[0] === 0) {
                return res.status(404).json({ errors: ['Speaker not found!'] });
            }
            const data = await speaker.findOne({where: {id: req.params.id}});

            res.status(201).json({ data });
        } catch (error) {
            res.status(500).json(['Error updating SPEAKER']);
        }
    }
    // deleting user
    async deleteSpeaker(req, res, next) {
        try {
            const data = await speaker.destroy({
                where: { id: req.params.id },
                attributes: {exclude: ["createdAt", "updatedAt"]}
            })

            if(!data) {
                return res.status(404).json({ errors: ['Speaker not found!'] });
            }

            res.status(200).json({ messages: ['Specified speaker has successfully been deleted!'] });
        } catch (error) {
            res.status(500).json(['Error deleting SPEAKER']);
        }
    }
}

module.exports = new Speaker();