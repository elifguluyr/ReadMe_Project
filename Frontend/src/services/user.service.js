import api from '../lib/axios';

class UserService {
  async getUserProfile(userId) {
    const timestamp = new Date().getTime();
    const response = await api.get(`/profile/${userId}?t=${timestamp}`);
    return response.data;
  }

  
  async updateProfile(profileData) {
    const response = await api.put('/profile/update', profileData);
    return response.data;
  }

  
  async toggleFollow(targetUserId) {
    const response = await api.post(`/follow/${targetUserId}`);
    return response.data;
  }

  
  async deleteAccount() {
    const response = await api.delete('/delete');
    return response.data;
  }
}

export default new UserService();
