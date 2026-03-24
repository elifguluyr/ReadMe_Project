const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");

router.get('/books/search', bookController.searchBooks);
router.get("/books", bookController.getBooks);

module.exports = router;