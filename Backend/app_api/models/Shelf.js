const mongoose = require("mongoose");

const ShelfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }
  ]
});

module.exports = mongoose.model("Shelf", ShelfSchema);