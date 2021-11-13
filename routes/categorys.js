const express = require("express"); // Import Express

// Import Validators
const {
  createOrUpdateCategoryValidator,
} = require("../middlewares/validators/categorys");

// Import controllers
const {
  getAllCategory,
  createCategory,
  getOneCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categorys");

const router = express.Router();

router
  .route("/")
  .get(getAllCategory)
  .post(createOrUpdateCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getOneCategory)
  .put(createOrUpdateCategoryValidator, updateCategory)
  .delete(deleteCategory);

// Exports
module.exports = router;
