const { event, user, category, speaker, bookmark, comment } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class Events {
    static async retrieveAllEvent(req, res, next) {
        try {
            // let currentDate = new Date(new Date().getTime());
            let getDate = new Date().getDate();
            let getMonth = new Date().getMonth();
            let getYear = new Date().getFullYear();
            let getHour = new Date().getHours();
            let getMinute = new Date().getMinutes();
            let fullDate = `${getDate}-${getMonth}-${getYear} ${getHour}:${getMinute}`;

            const {
                title = "",
                cat,
                today = fullDate,
                tomorrow = "",
                this_week = "",
                this_month = "",
                this_year = "",
                all_upcoming = "",
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
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'] },
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

    static async retrieveEventToday(req, res, next) {
        try {
            const { page = 1, limit = 8 } = req.query;

            const startToday = moment().startOf('day').format('MM-DD-YYYY hh:mm');
            const endToday = moment().startOf('day').format('MM-DD-YYYY hh:mm');

            let getEvent = await event.findAll({
                where: {
                    dateStart: {
                        [Op.between]: [startToday, endToday]
                    }
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
            })

            if (getEvent.length === 0) {
                return res.status(404).json({ status: 404, message: 'No events today/events not found' })
            }

            res.status(200).json({ status: 200, success: 'true', data: getEvent })

        } catch (error) {
            res.status(500).json({ status: 500, message: 'Internal Server Error Retrieve Event Today' || error.message });
        }
    }

    static async retrieveEventTomorrow(req, res, next) {
        try {
            const { page = 1, limit = 8 } = req.query;

            const DD = new Date().getDate()
            const startTomorrow = moment().startOf('day').format(`MM-${DD + 1}-YYYY hh:mm`);
            const endTomorrow = moment().endOf('day').format(`MM-${DD + 1}-YYYY hh:mm`);

            let getEvent = await event.findAll({
                where: {
                    dateStart: {
                        [Op.between]: [startTomorrow, endTomorrow]
                    }
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
            })

            if (getEvent.length === 0) {
                return res.status(404).json({ status: 404, message: 'No event tomorrow' })
            }

            res.status(200).json({ status: 200, succes: 'true', data: getEvent });

        } catch (error) {
            res.status(500).json({ status: 500, message: 'Internal Server Error Retrieve Event Tomorrow' || error.message });
        }

    }

}

module.exports = Events;