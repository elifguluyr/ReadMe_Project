const express = require("express");
const router = express.Router();

const shelfController = require("../controllers/shelfController");

router.post("/", shelfController.createShelf);
router.post("/:shelfId/books", shelfController.addBookToShelf);
router.delete("/:shelfId/books/:bookId", shelfController.removeBookFromShelf);
module.exports = router;