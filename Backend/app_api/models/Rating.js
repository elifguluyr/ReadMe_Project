const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
});

module.exports = mongoose.model("Rating", RatingSchema);