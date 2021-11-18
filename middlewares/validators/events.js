const path = require('path');
const crypto = require('crypto');
const validator = require('validator');
const { promisify } = require('util');

exports.eventValidator = async (req, res, next) => {
    try {
        const errors = [];

        const {
            id_category,
            title,
            detail,
            dateStart,
            dateEnd,
            organizer,
            link
        } = req.body

        if (!validator.isInt(id_category)) {
            errors.push('id_category must be a number');
        }

        if (validator.isEmpty(title)) {
            errors.push('title must be filled');
        }

        if (req.files === null) {
            errors.push('image must be filled');
        }

        if (validator.isEmpty(dateStart)) {
            errors.push('date start must be filled, format date: YYYY-MM-DD hh:mm')
        }

        if (validator.isEmpty(dateEnd)) {
            errors.push('date start must be filled, format date: YYYY-MM-DD hh:mm')
        }

        if (validator.isEmpty(detail)) {
            errors.push('detail must be filled');
        }

        if (validator.isEmpty(organizer)) {
            errors.push('organizer must be filled');
        }

        if (validator.isEmpty(link)) {
            errors.push('link must be filled');
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors: errors });
        }

        if (req.files != null) {
            const file = req.files.imageEvent;

            if (!file.mimetype.startsWith('image')) {
                errors.push('File must be an Image');
            }

            if (file.size > 1000000) {
                errors.push('image must be less than 1MB');
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors: errors });
            }

            let fileName = crypto.randomBytes(16).toString('hex');

            file.name = `${fileName}${path.parse(file.name).ext}`;

            const move = promisify(file.mv);

            await move(`./public/images/event/${file.name}`);

            req.body.imageEvent = file.name;
        }

        next();

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error Validator Event', errors: error });
    }
}