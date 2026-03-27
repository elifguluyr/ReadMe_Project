const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://readme-api-m7pb.onrender.com/api/signup', {
      name: 'Test Antigravity',
      email: 'test@antigravity1.com',
      password: 'password123'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error payload:", err.response?.data || err.message);
  }
}
test();
