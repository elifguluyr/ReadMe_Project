import api from '../lib/axios';

const getPosts = async () => {
  const response = await api.get('/paylasim');
  return response.data;
};

const getPostById = async (postId) => {
  const response = await api.get(`/paylasim/${postId}`);
  return response.data;
};

const createPost = async (postText) => {
  const response = await api.post('/paylasim', { postText });
  return response.data;
};

const deletePost = async (postId) => {
  const response = await api.delete(`/paylasim/${postId}`);
  return response.data;
};

const getComments = async (postId) => {
  const response = await api.get(`/paylasim/${postId}/yorumlar`);
  return response.data;
};

const addComment = async (postId, commentText) => {
  const response = await api.post(`/paylasim/${postId}/yorum`, { commentText });
  return response.data;
};

const deleteComment = async (postId, commentId) => {
  const response = await api.delete(`/paylasim/${postId}/yorum/${commentId}`);
  return response.data;
};

const updateComment = async (postId, commentId, commentText) => {
  const response = await api.put(`/paylasim/${postId}/yorum/${commentId}`, { commentText });
  return response.data;
};

const toggleLike = async (postId) => {
  const response = await api.post(`/paylasim/${postId}/begen`);
  return response.data;
};

export default {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  getComments,
  addComment,
  deleteComment,
  updateComment,
  toggleLike,
};
