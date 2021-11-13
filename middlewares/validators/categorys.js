const path = require("path");
const validator = require("validator");
const { event } = require("../../models");

exports.createOrUpdateCategoryValidator = async (req, res, next) => {
  try {
    const error = [];

    if (!validator.isInt(req.body.id_event.toString())) {
      errors.push(" ID event must be number");
    }

    if (error.length > 0) {
      return res.status(404).json({ errors: errors });
    }
    next();
  } catch (error) {
    res.status(500).json({ errors: ["Internal Server Error"] });
  }
};
