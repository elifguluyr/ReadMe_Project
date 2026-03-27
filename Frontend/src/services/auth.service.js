import api from '../lib/axios';

/**
 * Authentication service handling login and register API calls.
 */
class AuthService {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data; // Expected: { token, user: { ... } }
  }

  async register(name, email, password, bio, profileImage) {
    // Exact mapping from Elif-Gül-Uyar-Rest-API-Görevleri.md
    const payload = { name, email, password };
    if (bio) payload.bio = bio;
    if (profileImage) payload.profileImage = profileImage;
    
    const response = await api.post('/signup', payload);
    return response.data;
  }
}

export default new AuthService();
