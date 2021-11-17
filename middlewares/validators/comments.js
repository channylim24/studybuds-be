const path = require("path");
const validator = require("validator");
const { event } = require("../../models");

exports.createOrUpdateCommentValidator = async (req, res, next) => {
  try {
    // validate the req
    const errors = [];

    if (!validator.isInt(req.body.id_event.toString())) {
      errors.push("ID Event must be number (integer");
    }

    if (errors.length > 0) {
      return res.status(404).json({ errors: errors });
    }

    next();
  } catch (error) {
    res.status(500).json({ errors: ["Internal Server Error"], message: error });
  }
};
