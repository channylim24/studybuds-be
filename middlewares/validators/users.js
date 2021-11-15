const path = require('path');
const crypto = require('crypto');
const validator = require('validator');
const { promisify } = require('util');

exports.createUserValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    if (req.files != null) {
      const file = req.files.avatar;


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

      await move(`./public/images/user${file.name}`);

      req.body.avatar = file.name;
    } else {
      req.body.avatar = null;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ['Internal Server Error test'] });
  }
};
