const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  googleId: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String
  },
  publishedYear: {
    type: Number
  },
  imageLinks: {
    thumbnail: String
  }
});

module.exports = mongoose.model("Book", BookSchema);