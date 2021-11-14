const { event, user, category, speaker, bookmark, comment } = require('../models');
const { Op } = require('sequelize');

class Events {
    static async retrieveAllEvent(req, res, next) {
        try {
            // let currentDate = new Date(new Date().getTime());
            let dateToday = new Date(new Date().getTime());
            let dateTomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            let dateThisWeek = '';
            let dateThisMonth = '';
            let dateThisYear = '';
            let dateUpcoming = '';

            const {
                title = "",
                today,
                cat,
                tomorrow,
                this_week,
                this_month,
                this_year,
                all_upcoming,
                page = 1,
                limit = 8,
            } = req.query;

            let getEvent = await event.findAll({
                where: {
                    [Op.or]: [
                        {
                            title: {
                                [Op.like]: `%${title}%`
                            }
                        },
                    ]

                },
                attributes: { exclude: ['id_user', 'id_customer', 'id_speaker', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: user,
                        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'password'] }
                    },
                    {
                        model: category,
                        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                    {
                        model: speaker,
                        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'] }
                    },
                ],
                order: [['createdAt', 'DESC']], // sort descending
                limit: parseInt(limit),
                offset: (parseInt(page) - 1) * parseInt(limit)
            });

            // // pagination
            // let pagination = +page;
            // let limitation = +limit;

            // if ((getEvent.length > 10) && (!limit && !page)) {
            //     pagination = 1;
            //     limitation = 8;
            // }

            // const startIndex = (pagination - 1) * limitation;
            // const endIndex = pagination * limitation

            // const result = getEvent.slice(startIndex, endIndex)

            if (getEvent.length === 0) {
                return res.status(404).json({ status: 404, message: 'Events not found' });
            }

            res.status(200).json({ status: 200, success: 'true', data: getEvent })

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: 'Internal Server Error Retrieve All Event' || error.message });
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
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'] },
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
                return res.status(404).json({ status: 404, message: 'Event not found' });
            }

            res.status(200).json({ status: 200, message: 'Success', data: getDetailEvent });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: 'Internal Server Error Retrieve Detail Event' || error.message });
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
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'] },
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

            res.status(201).json({ status: 201, message: 'Success create event', data: getEvent })

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: 'Internal Server Error Create Event' || error.message });
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
                return res.status(404).json({ status: 500, message: 'Event not found' });
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

            res.status(201).json({ status: 201, message: 'Success update event', data: getEvent });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: 'Internal Server Error Update Event' || error.message });
        }
    }

    static async deleteEvent(req, res, next) {
        try {
            let removeEvent = await event.destroy({ where: { id: req.params.id } });

            if (!removeEvent) {
                return res.status(404).json({ status: 404, message: 'Event not found' });
            }

            res.status(200).json({ status: 200, message: 'Delete Successful' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: 'Internal Server Error Delete Event' || error.message });
        }
    }

}

module.exports = Events;