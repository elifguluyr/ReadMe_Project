import api from '../lib/axios';

const shelfService = {
  createShelf: async (name) => {
    const response = await api.post('/shelves', { name });
    return response.data;
  },

  addBookToShelf: async (shelfId, bookData) => {
    // bookData expectation: { googleId: string, title: string, author: string }
    const response = await api.post(`/shelves/${shelfId}/books`, bookData);
    return response.data;
  },

  removeBookFromShelf: async (shelfId, bookId) => {
    const response = await api.delete(`/shelves/${shelfId}/books/${bookId}`);
    return response.data;
  }
};

export default shelfService;
