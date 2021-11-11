const { event, user, category, speaker, bookmark, comment } = require('../models');

class Events {
    static async getAllEvent(req, res, next) {
        try {
            let data = await event.findAll({
                attributes: { exclude: ['id_user', 'id_customer', 'id_speaker', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: user,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: category,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: speaker,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                    },
                ],
            });

            if (data.length === 0) {
                return res.status(404).json({ errors: ['Events not found'] });
            }

            res.status(200).json({ data })

        } catch (error) {
            console.log(error);
            res.status(500).json({ errors: ['Internal Server Error'] });
        }
    }

    static async getDetailEvent(req, res, next) {
        try {
            let data = await event.findOne({
                where: { id: req.params.id },
                attributes: { exclude: ['id_user', 'id_customer', 'id_speaker'] },
                include: [
                    {
                        model: user,
                    },
                    {
                        model: category,
                    },
                    {
                        model: speaker,
                    },
                ],
            })

            if (!data) {
                return res.status(404).json({ errors: ['Event not found'] });
            }

            res.status(200).json({ data });

        } catch (error) {
            console.log(error);
            res.status(500).json({ errors: ['Internal Server Error'] });
        }
    }

    static async createEvent(req, res, next) {
        try {
            const newData = await event.create(req.body);

            const data = await event.findOne({
                where: {
                    id: newData.id,
                },
                attributes: { exclude: ['id_user', 'id_customer', 'id_speaker'] },
                include: [
                    {
                        model: user,
                    },
                    {
                        model: category,
                    },
                    {
                        model: speaker,
                    },
                ],
            });

            res.status(201).json({ data })

        } catch (error) {
            console.log(error);
            res.status(500).json({ errors: ['Internal Server Error'] });
        }
    }

    static async updateEvent(req, res, next) {
        try {
            const updatedData = await event.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });

            if (updatedData[0] === 0) {
                return res.status(404).json({ errors: ['Event not found'] });
            }

            const data = await event.findOne({
                where: {
                    id: req.params.id,
                },
                attributes: { exclude: ['id_user', 'id_customer', 'id_speaker', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: user,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: category,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: speaker,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    }
                ]
            });

            res.status(201).json({ data });

        } catch (error) {
            console.log(error);
            res.status(500).json({ errors: ['Internal Server Error'] });
        }
    }

    static async deleteEvent(req, res, next) {
        try {
            let data = await event.destroy({ where: { id: req.params.id } });

            if (!data) {
                return res.status(404).json({ errors: ['Event not found'] });
            }

            res.status(200).json({ message: 'Delete Successful' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ errors: ['Internal Server Error'] });
        }
    }

}

module.exports = Events;