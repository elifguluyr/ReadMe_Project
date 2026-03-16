const mongoose = require("mongoose");
const Shelf = require("../models/Shelf");
const Book = mongoose.model("Book");

const createShelf = async (req, res) => {
  try {
    const { name } = req.body;

    const newShelf = new Shelf({
      name
    });

    const savedShelf = await newShelf.save();

    res.status(201).json(savedShelf);
  } catch (error) {
    res.status(500).json({
      message: "Raf oluşturulamadı",
      error: error.message
    });
  }
};

const addBookToShelf = async (req, res) => {
  const { shelfId } = req.params;
  const { googleId, title, author } = req.body;

  try {
    let book = await Book.findOne({ googleId });

    if (!book) {
      book = new Book({
        googleId,
        title,
        author
      });
      await book.save();
    }

    const updatedShelf = await Shelf.findByIdAndUpdate(
      shelfId,
      { $addToSet: { books: book._id } },
      { new: true }
    );

    if (!updatedShelf) {
      return res.status(404).json({ message: "Raf bulunamadı" });
    }

    res.status(200).json({
      message: "Kitap rafa eklendi",
      shelf: updatedShelf
    });
  } catch (err) {
    res.status(500).json({
      message: "Kitap eklenirken hata oluştu",
      error: err.message
    });
  }
};
const removeBookFromShelf = async (req, res) => {
  const { shelfId, bookId } = req.params;

  try {
    const updatedShelf = await Shelf.findByIdAndUpdate(
      shelfId,
      { $pull: { books: bookId } },
      { new: true }
    );

    if (!updatedShelf) {
      return res.status(404).json({ message: "Raf bulunamadı" });
    }

    res.status(200).json({
      message: "Kitap raftan silindi",
      shelf: updatedShelf
    });
  } catch (err) {
    res.status(500).json({
      message: "Kitap raftan silinemedi",
      error: err.message
    });
  }
};
module.exports = {
  createShelf,
  addBookToShelf,
  removeBookFromShelf
};