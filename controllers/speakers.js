const { speaker, user } = require('../models');

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
                attributes: { exclude: ["updatedAt", "deletedAt"] }
            })

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ errors: ['Error creating SPEAKER'], message: error });
        }
    }
    // show all speaker
    async allSpeaker(req, res, next) {
        try {
            const data = await speaker.findAll({
                attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] }
            })

            if (data.lengt === 0) {
                return res.status(404).json(['Speaker not found!'])
            }

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ errors: ['Error getting all SPEAKER'], message: error });
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
            res.status(500).json({ errors: ['Error getting all SPEAKER'], message: error });
        }
    }
    // updating speaker
    async updateSpeaker(req, res, next) {
        try {
            // 1. speaker dibuat oleh id event masing2 yang id event tersebut dibuat oleh user tertentu
            // 2. hubungkan speaker tersebut dengan event yg membuatnya
            // 3. beri authority kepada user yang membuat event tersebut unutk menghapus dan meng update
            const data = await speaker.findOne({ where: { id: req.params.id } });

            res.status(201).json({ data });
        } catch (error) {
            res.status(500).json({ errors: ['Error updating SPEAKER'], message: error });
        }
    }
    // deleting user
    async deleteSpeaker(req, res, next) {
        try {
            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });

            if (currentUser.id != req.params.id) {
                return res.status(404).json({ errors: ['No edit access to speaker!'] });
            }

            if (currentUser == null) {
                return res.status(404).json({ errors: ['No edit access to speaker!'] });
            }

            else {
                let { firstName, lastName, email, password, avatar } = req.body;
                password = encrypt(password)
                await user.update(
                    { firstName, lastName, email, password, avatar },
                    {
                        where: { id: currentUser.id }
                    });
            }
            const data = await speaker.destroy({
                where: { id: currentUser.id },
                attributes: { exclude: ["createdAt", "updatedAt"] }
            })

            if (!data) {
                return res.status(404).json({ errors: ['Speaker not found!'] });
            }

            res.status(200).json({ messages: ['Specified speaker has successfully been deleted!'] });
        } catch (error) {
            res.status(500).json({ errors: ['Error deleting SPEAKER'], message: error });
        }
    }
}

module.exports = new Speaker();