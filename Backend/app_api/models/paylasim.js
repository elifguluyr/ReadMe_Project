const mongoose = require('mongoose');

const yorumSemasi = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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
    ref: 'user', // Model isminle aynı olmalı
    required: true
  },
  postText: {
    type: String,
    required: true,
    trim: true // Başındaki ve sonundaki boşlukları otomatik siler
  },
  // 'likes' alanını sildik, çünkü likedBy.length bize sayıyı verecek.
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  date: {
    type: Date,
    default: Date.now
  },
  comments: [yorumSemasi]
});

module.exports = mongoose.model("Paylasim", paylasimSemasi, "paylasims");