const Book = require("../models/Book");
const axios = require("axios");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Kitaplar alınamadı", error: error.message });
  }
};
const searchBooks = async (req, res) => {
    const { q } = req.query; 

    if (!q) {
        return res.status(400).json({ message: "Lütfen aranacak bir kitap ismi girin." });
    }

    try {
        const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=15`
        );

        if (!response.data.items) {
            return res.status(404).json({ message: "Aramanıza uyan bir sonuç bulunamadı." });
        }

        const results = response.data.items.map(item => ({
            googleId: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || ["Yazar Bilgisi Yok"],
            description: item.volumeInfo.description || "Açıklama bulunmuyor.",
            categories: item.volumeInfo.categories || [],
            imageLinks: item.volumeInfo.imageLinks || { thumbnail: "https://via.placeholder.com/150" },
            averageRating: item.volumeInfo.averageRating || 0,
            ratingsCount: item.volumeInfo.ratingsCount || 0
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Kitaplar aranırken bir hata oluştu.", error: error.message });
    }
};

module.exports = {
  getBooks,
  searchBooks,
};