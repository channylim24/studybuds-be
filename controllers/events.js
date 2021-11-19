const { event, user, category, bookmark, comment, sequelize } = require('../models');
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
                search = '',
            } = req.query;

            let cat = req.query.cat;
            let date = req.query.date;
            let startDate = req.query.startDate;
            let endDate = req.query.endDate;
            let orderbydate = req.query.orderbydate;
            let orderbytitle = req.query.orderbytitle;

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
            let query = `select e.id , u."firstName" , u."lastName" , u.email , e."imageEvent" , e.title , c."name" as category ,`
            query += `e.detail , e.organizer , e.link , e."nameSpeaker" , e."dateStart" , e."dateEnd", e."createdAt" `
            query += `from events e `
            query += `inner join users u on e.id_user = u.id `
            query += `inner join categories c on e.id_category = c.id `
            query += `where e."deletedAt" isnull `

            // filtering search by title
            if (search) {
                query += ` and "title" ILIKE '%${search}%' `
            }

            // calculate date range
            if (date) {
                date = date.split('-')
                query += ` and ("dateStart" < '${date[0]}-${date[1]}-${date[2]} 23:59:59' and "dateStart" > '${date[0]}-${date[1]}-${date[2]} 00:00:00')`
            } else if (startDate && endDate) {
                startDate = startDate.split('-')
                endDate = endDate.split('-')
                query += ` and ("dateStart" < '${endDate[0]}-${endDate[1]}-${endDate[2]} 23:59:59' and "dateStart" > '${startDate[0]}-${startDate[1]}-${startDate[2]} 00:00:00')`
            }

            // filtering by date, date range & category
            if (search && (date || (startDate && endDate)) && cat) {
                query += ` and "id_category" = ${cat} `
            } else if (cat) {
                query += ` and "id_category" = ${cat} `
            }

            // filtering order
            if (orderbydate) {
                query += `order by e."createdAt" ${orderbydate}`
            } else if (orderbytitle) {
                query += `order by e.title ${orderbytitle}`
            } else {
                query += `order by e."createdAt" ASC`
            }

            let getEvents = await sequelize.query(query)
            getEvents = getEvents[0]
            if (getEvents.length === 0) {
                return res.status(404).json({ status: 404, success: false, message: 'Event not found - retrieve all event' });
            }

            let page = +req.query.page;
            let limit = +req.query.limit;
            if ((getEvents.length > 8) && (!limit && !page)) {
                page = 1
                limit = 8
            }

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const result = page && limit ? getEvents.slice(startIndex, endIndex) : getEvents

            res.status(200).json({ status: 200, success: true, 'totalData': getEvents.length, message: 'Success Retrieve All Event', data: result });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, success: false, message: 'Internal Server Error Retrieve All Event', message: error });
        }
    }

    static async retrieveMyEvent(req, res, next) {
        try {
            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });

            const {
                isthistoday,
                isthistomorrow,
                isthisweek,
                isthismonth,
                isthisyear,
                comingsoon,
                search = '',
            } = req.query;

            let cat = req.query.cat;
            let date = req.query.date;
            let startDate = req.query.startDate;
            let endDate = req.query.endDate;
            const orderbydate = req.query.orderbydate ? req.query.orderbydate : 'DESC';

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
            let query = `select e.id , e."imageEvent" , e.title , c."name" as category ,`
            query += `e.detail , e.organizer , e.link , e."nameSpeaker" , e."dateStart" , e."dateEnd" , e."deletedAt" `
            query += `from events e `
            query += `inner join users u on e.id_user = u.id `
            query += `inner join categories c on e.id_category = c.id `
            query += `where e."deletedAt" isnull and e.id_user = ${currentUser.id}`

            // filtering search by title
            if (search) {
                query += ` and "title" ILIKE '%${search}%' `
            }

            // calculate date range
            if (date) {
                date = date.split('-')
                query += ` and ("dateStart" < '${date[0]}-${date[1]}-${date[2]} 23:59:59' and "dateStart" > '${date[0]}-${date[1]}-${date[2]} 00:00:00')`
            } else if (startDate && endDate) {
                startDate = startDate.split('-')
                endDate = endDate.split('-')
                query += ` and ("dateStart" < '${endDate[0]}-${endDate[1]}-${endDate[2]} 23:59:59' and "dateStart" > '${startDate[0]}-${startDate[1]}-${startDate[2]} 00:00:00')`
            }

            // filtering by date, date range & category
            if (search && (date || (startDate && endDate)) && cat) {
                query += ` and "id_category" = ${cat} `
            } else if (cat) {
                query += ` and "id_category" = ${cat} `
            }

            // filtering order
            query += `order by "id" ${orderbydate}`
            let getEvents = await sequelize.query(query)
            getEvents = getEvents[0]
            if (getEvents.length === 0) {
                return res.status(404).json({ status: 404, success: false, message: 'Event not found - retrieve all event' });
            }

            let page = +req.query.page;
            let limit = +req.query.limit;
            if ((getEvents.length > 8) && (!limit && !page)) {
                page = 1
                limit = 8
            }

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const result = page && limit ? getEvents.slice(startIndex, endIndex) : getEvents

            res.status(200).json({ status: 200, success: true, 'totalData': getEvents.length, message: 'Success Retrieve All Event', data: result });

        } catch (error) {
            // console.log(error);
            res.status(500).json({ status: 500, success: false, message: 'Internal Server Error Retrieve All Event', message: error });
        }
    }

    static async retrieveDetailEvent(req, res, next) {
        try {
            let getDetailEvent = await event.findOne({
                where: { id: req.params.id },
                attributes: { exclude: ['id_user', 'id_category'] },
                include: [
                    {
                        model: user,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password', 'token'] },
                    },
                    {
                        model: category,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                    {
                        model: comment,
                    }
                ],
            })

            if (!getDetailEvent) {
                return res.status(404).json({ status: 404, success: false, message: 'Event not found - retrieve detail event' });
            }

            res.status(200).json({ status: 200, success: true, message: 'Success Retrieve Detail Event', data: getDetailEvent });

        } catch (error) {
            // console.log('error');
            res.status(500).json({ status: 500, success: false, errors: ['Internal Server Error Retrieve Detail Event'], message: error });
        }
    }

    static async createEvent(req, res, next) {
        try {
            // const createdEvent = await event.create(req.body);
            // const getEvent = await event.findOne({
            //     where: {
            //         id: createdEvent.id,
            //     },
            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });

            req.body.id_user = currentUser.id;

            const createdEvent = await event.create(req.body);

            const getEvent = await event.findOne({
                where: {
                    id: createdEvent.id,
                },
                attributes: { exclude: ['id_user', 'id_customer'] },
                include: [
                    {
                        model: user,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'token', 'password'] },
                    },
                    {
                        model: category,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                ],
            });


            res.status(201).json({ status: 201, success: true, message: 'Success create event', data: getEvent })

        } catch (error) {
            // console.log(error);
            res.status(500).json({ status: 500, success: false, errors: ['Internal Server Error Create Event'], message: error });
        }
    }

    static async updateEvent(req, res, next) {
        try {
            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });
            const currentEvent = await event.findOne(
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            if (currentEvent === null) {
                return res.status(404).json({ status: 500, message: 'Event not found' });
            }

            if (currentUser.id != currentEvent.id_user) {
                return res.status(404).json({ errors: ['No edit access to this event!'] });
            }

            if (currentUser == null) {
                return res.status(404).json({ errors: ['No edit access to this event!'] });
            }

            await event.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });

            const getEvent = await event.findOne({
                where: {
                    id: req.params.id,
                },
                attributes: { exclude: ['id_user', 'id_customer', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: user,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'token', 'password'] },
                    },
                    {
                        model: category,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    },
                ]
            });

            res.status(201).json({ status: 201, success: true, message: 'Success update event', data: getEvent });

        } catch (error) {
            res.status(500).json({ status: 500, success: false, errors: ['Internal Server Error Update Event'], message: error });
        }
    }

    static async deleteEvent(req, res, next) {
        try {
            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });
            const currentEvent = await event.findOne(
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            if (currentEvent === null) {
                return res.status(404).json({ status: 500, message: 'Event not found' });
            }

            if (currentUser.id != currentEvent.id_user) {
                return res.status(404).json({ errors: ['No edit access to this event!'] });
            }

            if (currentUser == null) {
                return res.status(404).json({ errors: ['No edit access to this event!'] });
            }
            await event.destroy({ where: { id: req.params.id } });

            res.status(200).json({ status: 200, success: true, message: 'Delete Successful' });

        } catch (error) {
            res.status(500).json({ status: 500, success: false, errors: ['Internal Server Error Delete Event'], message: error });
        }
    }

}

module.exports = Events;