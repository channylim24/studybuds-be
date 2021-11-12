const { event, user, category, speaker, bookmark, comment } = require('../models');
const { Op } = require('sequelize');

class Events {
    static async retrieveAllEvent(req, res, next) {
        try {
            const { title, category, date, page = 1, limit = 1 } = req.query;

            let getEvent;

            // Filtering by title, category, date
            if (title || category || date) {
                getEvent = await event.findAll({
                    where: {
                        title: { [Op.like]: `%${title}%` },     // find before and after title
                        category: category, // find by category
                        // dateStart: date,    // find by date
                    },
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
                    order: [['createdAt', 'DESC']]   // sort descending
                });

                // pagination
                let pagination = +page;
                let limitation = +limit;

                if ((getEvent.length > 10) && (!limit && !page)) {
                    pagination = 1;
                    limitation = 8;
                }

                const startIndex = (pagination - 1) * limitation;
                const endIndex = pagination * limitation

                const result = getEvent.slice(startIndex, endIndex)


                res.status(200).json({ status: 200, data: result })
            }

            if (getEvent.length === 0) {
                return res.status(404).json({ status: 404, errors: ['Events not found'] });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, errors: ['Internal Server Error'] });
        }
    }

    static async retrieveDetailEvent(req, res, next) {
        try {
            let getDetailEvent = await event.findOne({
                where: { id: req.params.id },
                attributes: { exclude: ['id_user', 'id_customer', 'id_speaker'] },
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
                    },
                ],
            })

            if (!getDetailEvent) {
                return res.status(404).json({ status: 404, errors: ['Event not found'] });
            }

            res.status(200).json({ status: 200, data: getDetailEvent });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, errors: ['Internal Server Error'] });
        }
    }

    static async createEvent(req, res, next) {
        try {
            const createdEvent = await event.create(req.body);

            const getEvent = await event.findOne({
                where: {
                    id: createdEvent.id,
                },
                attributes: { exclude: ['id_user', 'id_customer', 'id_speaker'] },
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
                    },
                ],
            });

            res.status(201).json({ status: 201, data: getEvent })

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, errors: ['Internal Server Error'] });
        }
    }

    static async updateEvent(req, res, next) {
        try {
            const updatedEvent = await event.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });

            if (updatedEvent[0] === 0) {
                return res.status(404).json({ status: 500, errors: ['Event not found'] });
            }

            const getEvent = await event.findOne({
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

            res.status(201).json({ status: 201, data: getEvent });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, errors: ['Internal Server Error'] });
        }
    }

    static async deleteEvent(req, res, next) {
        try {
            let removeEvent = await event.destroy({ where: { id: req.params.id } });

            if (!removeEvent) {
                return res.status(404).json({ errors: ['Event not found'] });
            }

            res.status(200).json({ status: 200, message: 'Delete Successful' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, errors: ['Internal Server Error'] });
        }
    }

}

module.exports = Events;