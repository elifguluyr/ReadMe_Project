import api from '../lib/axios';

/**
 * Authentication service handling login and register API calls.
 */
class AuthService {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data; 
  }

  async register(name, email, password, bio, profileImage) {
    const payload = { name, email, password };
    if (bio) payload.bio = bio;
    if (profileImage) payload.profileImage = profileImage;
    
    const response = await api.post('/signup', payload);
    return response.data;
  }
}

export default new AuthService();
