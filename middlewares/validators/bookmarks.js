const path = require("path");
const validator = require("validator");
const { event } = require("../../models");

exports.createOrUpdateCommentBookmark = async (req, res, next) => {
  try {
    // validate the req
    const error = [];

    if (!validator.isInt(req.body.id_user.toString())) {
      errors.push("ID User must be number (integer");
    }

    if (!validator.isInt(req.body.id_event.toString())) {
      errors.push("ID Event must be number (integer");
    }

    if (error.length > 0) {
      return res.status(404).json({ errors: errors });
    }

    next();
  } catch (error) {
    res.status(500).json({ errors: ["Internal Server Error"] });
  }
};
