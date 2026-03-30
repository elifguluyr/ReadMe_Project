import api from '../lib/axios';

const ratingService = {
  getUserRatings: async () => {
    const response = await api.get('/ratings/user');
    return response.data;
  },

  addRating: async (bookId, rating) => {
    const response = await api.post('/ratings', { bookId, rating });
    return response.data;
  },
  
  updateRating: async (ratingId, rating) => {
    const response = await api.put(`/ratings/${ratingId}`, { rating });
    return response.data;
  },
  
  deleteRating: async (ratingId) => {
    const response = await api.delete(`/ratings/${ratingId}`);
    return response.data;
  }
};

export default ratingService;
