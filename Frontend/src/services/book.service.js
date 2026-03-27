import axios from 'axios';
import api from '../lib/axios';

const bookService = {
  getBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  
  searchBooks: async (query) => {
    try {
      const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      
      throw error; 
    }
  }
};

export default bookService;
