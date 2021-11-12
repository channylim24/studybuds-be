// const validator = require("validator");
// const { event } = require("../../models");

// exports.createOrUpdateCommentValidator = async (req, res, next) => {
//   try {
//     // validate the req
//     const error = [];

//     if (!validator.isInt(req.body.id_user.toString())) {
//       errors.push("ID User must be number (integer");
//     }

//     if (!validator.isInt(req.body.id_event.toString())) {
//       errors.push("ID Event must be number (integer");
//     }

//     if (error.length > 0) {
//       return res.status(404).json({ errors: errors });
//     }

//   } catch (error) {}
// };
