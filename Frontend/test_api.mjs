import axios from 'axios';

const apiURL = 'https://readme-api-m7pb.onrender.com';

async function performTaskTest() {
  const timestamp = Date.now();
  const testEmail = `elifgörev_${timestamp}@example.com`;
  
  const registerPayload = {
    name: "Elif",
    email: testEmail,
    password: "Guvenli123!",
    bio: "yeni kitap kurdu",
    profileImage: "ornekresim.com"
  };

  const loginPayload = {
    email: testEmail,
    password: "Guvenli123!"
  };

  console.log("=== ELİF GÜL UYAR GÖREVLERİ TESTİ ===");
  try {
    console.log(`\n➡️  GÖREV 1: Üye Olma (POST /api/signup)`);
    console.log(`Gönderilen Veri:`, registerPayload);
    const regRes = await axios.post(`${apiURL}/api/signup`, registerPayload);
    console.log(`✅ BAŞARILI! (Yetki Kodu: ${regRes.status})`);
    console.log(`Dönen Yanıt:`, { token: regRes.data.token.substring(0, 15) + "..." });

    console.log(`\n➡️  GÖREV 2: Giriş Yapma (POST /api/login)`);
    console.log(`Gönderilen Veri:`, loginPayload);
    const logRes = await axios.post(`${apiURL}/api/login`, loginPayload);
    console.log(`✅ BAŞARILI! (Yetki Kodu: ${logRes.status})`);
    console.log(`Dönen Yanıt:`, { token: logRes.data.token.substring(0, 15) + "..." });
  } catch (err) {
    console.error(`❌ HATA OLUŞTU!`, err.response?.status, err.response?.data);
  }
}

performTaskTest();
