const Book = require("../models/Book");
const axios = require("axios");
const redis = require("redis");


let redisClient;
(async () => {
  try {
    redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
    redisClient.on("error", (error) => console.error(`[Redis] Error : ${error}`));
    await redisClient.connect();
    console.log("[Redis] Bağlantı başarılı!");
  } catch (error) {
    console.error("[Redis] Bağlantı kurulamadı, cache devre dışı kalabilir.", error);
  }
})();

const getBooks = async (req, res) => {
  try {
    
    if (redisClient && redisClient.isReady) {
      const cachedBooks = await redisClient.get("all_books");
      if (cachedBooks) {
        console.log("[Redis] Kitaplar cache'den çok hızlı getirildi! 🚀");
        return res.status(200).json(JSON.parse(cachedBooks));
      }
    }

    
    console.log("[MongoDB] Kitaplar veritabanından çekiliyor... 🐢");
    const books = await Book.find();

    
    if (redisClient && redisClient.isReady) {
      await redisClient.setEx("all_books", 3600, JSON.stringify(books));
    }

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

    const cacheKey = `search_books_${q.trim().toLowerCase()}`;

    try {
        // 1. ÖNCE REDIS'E SOR (CACHE HIT KONTROLÜ)
        if (redisClient && redisClient.isReady) {
            const cachedResults = await redisClient.get(cacheKey);
            if (cachedResults) {
                console.log(`[Redis] "${q}" araması cache'den çok hızlı getirildi! 🚀`);
                return res.status(200).json(JSON.parse(cachedResults));
            }
        }

        // 2. REDIS'TE YOKSA GOOGLE API'YE GİT (CACHE MISS)
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=15${apiKey ? `&key=${apiKey}` : ""}`;
        
        console.log(`[API] "${q}" araması Google Books API'den çekiliyor... 🐢`);
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

        // 3. ÇEKİLEN VERİYİ REDIS'E KAYDET (Örn: 3600 saniye = 1 saat boyunca cache'te kalsın)
        if (redisClient && redisClient.isReady) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
            console.log(`[Redis] "${q}" aramasının sonuçları başarıyla cache'e kaydedildi. 💾`);
        }

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