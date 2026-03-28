import api from '../lib/axios';
import axios from 'axios';

class BookService {
  
  async _fetchFromOpenLibrary(query) {
    try {
      const olResponse = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=15`);
      if (!olResponse.data.docs || olResponse.data.docs.length === 0) return [];
      
      return olResponse.data.docs.map(item => ({
          googleId: item.key ? item.key.replace('/works/', '') : Math.random().toString().substring(2,10),
          title: item.title,
          authors: item.author_name || ["Bilinmeyen Yazar"],
          description: "Açıklama bulunmuyor.",
          categories: item.subject ? item.subject.slice(0, 3) : [],
          imageLinks: { thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : "https://via.placeholder.com/150" },
          averageRating: 0,
          ratingsCount: 0
      }));
    } catch (olError) {
      throw new Error('Her iki sistem de kitapları bulamadı.');
    }
  }

  async searchBooks(query) {
    if (!query) return [];
    
    try {
      // 1. ADIM: Önce bizim backend'e (Google API'ye) gitmeyi dene
      const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      // 2. ADIM: Eğer backend çökerse
      console.warn("Backend API hata verdi. Arkadaşının OpenLibrary yedek sistemi devreye giriyor...");
      return await this._fetchFromOpenLibrary(query);
    }
  }
}

export default new BookService();