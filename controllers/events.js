const { event, user, category, speaker, bookmark, comment, sequelize } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class Events {
    static async retrieveAllEvent(req, res, next) {
        try {
            const {
                isthistoday,
                isthistomorrow,
                isthisweek,
                isthismonth,
                isthisyear,
                comingsoon,
                title = '',
            } = req.query;

            let cat = req.query.cat
            let date = req.query.date;
            let startDate = req.query.startDate
            let endDate = req.query.endDate
            const order = req.query.order ? req.query.order : 'DESC';

            // moment js for filtering by date
            if (Number(isthistoday)) {
                startDate = moment().startOf('day').format('YYYY-MM-DD');
                endDate = moment().endOf('day').format('YYYY-MM-DD');
            } else if (Number(isthistomorrow)) {
                let DD = new Date().getDate();
                startDate = moment().startOf('day').format(`YYYY-MM-${DD + 1}`);
                endDate = moment().endOf('day').format(`YYYY-MM-${DD + 1}`);
            } else if (Number(isthisweek)) {
                startDate = moment().startOf('week').format('YYYY-MM-DD');
                endDate = moment().endOf('week').format('YYYY-MM-DD');
            } else if (Number(isthismonth)) {
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().endOf('month').format('YYYY-MM-DD');
            } else if (Number(isthisyear)) {
                startDate = moment().startOf('year').format('YYYY-MM-DD');
                endDate = moment().endOf('year').format('YYYY-MM-DD');
            } else if (Number(comingsoon)) {
                let DD = new Date().getDate();
                startDate = moment().startOf('week').format(`YYYY-MM-${DD + 7}`);
                endDate = moment().endDate('week').format(`YYYY-MM-${DD + 7}`);
            }

            // manual query database
            let query = `select e.id , u."firstName" , e."imageEvent" , e.title , c."name" as category ,`
            query += `e.detail , e.organizer , e.link , e."dateStart" , e."dateEnd" , s."imageSpeaker" ,`
            query += `s."name" as speakerName `
            query += `from events e `
            query += `inner join users u on e.id_user = u.id `
            query += `inner join categories c on e.id_category = c.id `
            query += `inner join speakers s on e.id_speaker = s.id `

            // filtering search by title
            if (title) {
                query += ` where "title" ILIKE '%${title}%' `
            }

            // calculate date range
            if (date) {
                date = date.split('-')
                query += ` where ("dateStart" < '${date[0]}-${date[1]}-${date[2]} 23:59:59' and "dateStart" > '${date[0]}-${date[1]}-${date[2]} 00:00:00')`
            } else if (startDate && endDate) {
                startDate = startDate.split('-')
                endDate = endDate.split('-')
                query += ` where ("dateStart" < '${endDate[0]}-${endDate[1]}-${endDate[2]} 23:59:59' and "dateStart" > '${startDate[0]}-${startDate[1]}-${startDate[2]} 00:00:00')`
            }

            // filtering by date, date range & category
            if ((date || (startDate && endDate)) && cat) {
                query += ` and "id_category" = ${cat} `
            } else if (cat) {
                query += ` where "id_category" = ${cat} `
            }

            // filtering order
            query += `order by "dateStart" ${order}`
            let getEvents = await sequelize.query(query)
            getEvents = getEvents[0]

            if (getEvents.length === 0) {
                return res.status(404).json({ status: 404, success: 'false', message: 'Event not found - retrieve all event' });
            }

            let page = +req.query.page;
            let limit = +req.query.limit;
            if ((getEvents.length > 8) && (!limit && !page)) {
                page = 1
                limit = 8
            }

            const startIndex = (page - 1) * limit
            const endIndex = page * limit

            const result = page && limit ? getEvents.slice(startIndex, endIndex) : getEvents

            res.status(200).json({ status: 200, data: result })

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: 'Internal Server Error Retrieve All Event', error });
        }
    }

    static async retrieveDetailEvent(req, res, next) {
        try {
            let getDetailEvent = await event.findOne({
                where: { id: req.params.id },
                attributes: { exclude: ['id_user', 'id_category', 'id_speaker'] },
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
                    {
                        model: comment,
                    }
                ],
            })

            if (!getDetailEvent) {
                return res.status(404).json({ status: 404, success: 'false', message: 'Event not found - retrieve detail event' });
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
                return res.status(404).json({ status: 500, message: 'Event not found - updated event' });
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
                return res.status(404).json({ status: 404, message: 'Event not found - delete event' });
            }

            res.status(200).json({ status: 200, message: 'Delete Successful' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: 'Internal Server Error Delete Event' || error.message });
        }
    }

}

module.exports = Events;