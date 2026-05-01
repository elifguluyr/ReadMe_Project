const mongoose = require("mongoose");
const Shelf = require("../models/Shelf");
const User = require("../models/users");
const Book = mongoose.model("Book");

const createShelf = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.auth._id;
    if (!name) {
      return res.status(400).json({ message: "Raf adı gereklidir" });
    }
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const newShelf = new Shelf({
      name,
      user: userId
    });

    const savedShelf = await newShelf.save();
    await User.findByIdAndUpdate(userId, { $addToSet: { shelf: savedShelf._id } }, { new: true });


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
  const { googleId, title, author, imageLinks } = req.body;
  const userId = req.auth._id;
  try {
    const shelf = await Shelf.findById(shelfId);

    if (!shelf) {
      return res.status(404).json({ message: "Raf bulunamadı" });
    }
    let book = await Book.findOne({ googleId });

    if (!book) {
      book = new Book({
        googleId,
        title,
        author,
        imageLinks
      });
      await book.save();
    } else if (!book.imageLinks?.thumbnail && imageLinks?.thumbnail) {
      book.imageLinks = imageLinks;
      await book.save();
    }

    const updatedShelf = await Shelf.findOneAndUpdate(
      { _id: shelfId, user: userId },
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
  const userId = req.auth._id;

  try {
    const updatedShelf = await Shelf.findOneAndUpdate(
      { _id: shelfId, user: userId },
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