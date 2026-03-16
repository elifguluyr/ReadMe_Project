const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/ratingController");

router.post("/", ratingController.addRating);
router.put("/:ratingId", ratingController.updateRating);
router.delete("/:ratingId", ratingController.deleteRating);
module.exports = router;