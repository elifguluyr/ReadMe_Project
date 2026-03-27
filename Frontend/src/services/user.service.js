import api from '../lib/axios';

class UserService {
  /**
   * Fetch a specific user's profile details by userId
   * Endpoint: GET /api/users/{userId}
   * @param {string} userId - ID of the user to fetch
   */
  async getUserProfile(userId) {
    // We send a direct GET request using the pre-configured Axios client.
    // Ensure that your backend expects "GET /users/:userId" or similar inside your routes.
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  }
}

export default new UserService();
