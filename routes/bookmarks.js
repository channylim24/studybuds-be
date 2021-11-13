const express = require("express");

// import validators
const {
  createOrUpdateBookmarkValidator,
} = require("../middlewares/validators/bookmarks");

// import controllers
const {
  getAllBookmark,
  createBookmark,
  getDetailBookmark,
  deleteBookmark,
  updateBookmark,
} = require("../controllers/bookmarks");

const router = express.Router();

// it will find route that has / first, after that it will find is it GET or POST
router
  .route("/")
  .get(getAllBookmark)
  .post(createOrUpdateBookmarkValidator, createBookmark);

//   it will find route that has /:id first, after that it will find is it GET or PUT or DELETE
router
  .route("/:id")
  .get(getDetailBookmark)
  .put(createOrUpdateBookmarkValidator, updateBookmark)
  .delete(deleteBookmark);

module.exports = router;
