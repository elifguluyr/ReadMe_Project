const mongoose = require('mongoose');

const yorumSemasi = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  commentText: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const paylasimSemasi = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postText: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [yorumSemasi]
});

module.exports = mongoose.model("Paylasim", paylasimSemasi, "paylasims");