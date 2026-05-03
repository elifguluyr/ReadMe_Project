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
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=15${apiKey ? `&key=${apiKey}` : ""}`;
        
        console.log(`Kitap araması yapılıyor: ${q}`);
        const response = await axios.get(url);

        if (!response.data || !response.data.items) {
            return res.status(404).json({ message: "Aramanıza uyan bir sonuç bulunamadı." });
        }

        const results = response.data.items.map(item => {
            const volumeInfo = item.volumeInfo || {};
            return {
                googleId: item.id,
                title: volumeInfo.title || "İsimsiz Kitap",
                authors: volumeInfo.authors || ["Yazar Bilgisi Yok"],
                description: volumeInfo.description || "Açıklama bulunmuyor.",
                categories: volumeInfo.categories || [],
                imageLinks: volumeInfo.imageLinks || { thumbnail: "https://via.placeholder.com/150" },
                averageRating: volumeInfo.averageRating || 0,
                ratingsCount: volumeInfo.ratingsCount || 0
            };
        });

        res.status(200).json(results);
    } catch (error) {
        console.error("Arama Hatası Detayı:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            message: "Kitaplar aranırken bir hata oluştu.", 
            error: error.message,
            details: error.response ? error.response.data : null
        });
    }
};

module.exports = {
  getBooks,
  searchBooks,
};