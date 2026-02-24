1. **Üye Olma (Oturum Açma)**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Sisteme henüz dahil olmamış yeni kullanıcıların hesap oluşturmasını sağlar. Kullanıcıdan alınan e-posta ve şifre gibi temel veriler doğrulanarak veritabanına yeni bir kullanıcı kaydı eklenir.

2. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Mevcut hesabı bulunan kullanıcıların kimlik doğrulaması yaparak sisteme erişim sağlamasına olanak tanır. Başarılı giriş sonrası kullanıcıya sistemdeki yetkili işlemleri yapabilmesi için bir oturum anahtarı (token) tanımlanır.

3. **Kullanıcı Profili Görüntüleme**
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Belirli bir kullanıcının profil detaylarını getirmek için kullanılır. Eğer `{userId}` giriş yapan kullanıcıya aitse, sistem tüm kişisel bilgileri (e-posta, hesap ayarları vb.) döndürür; eğer farklı bir kullanıcıya aitse sadece herkese açık veriler (ad, soyad, biyografi, takipçi sayısı ve okuma listeleri) listelenir. Bu uç nokta hem kişisel profil yönetimini hem de sosyal etkileşimi destekler.

4. **Profil Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının mevcut profil bilgilerini (ad, soyad, biyografi vb.) değiştirmesine imkan tanır. Güvenlik gereği kullanıcılar yalnızca kendi hesapları üzerinde güncelleme yetkisine sahiptir.

5. **Arama Yapma**
   - **API Metodu:** `GET /books/search`
   - **Açıklama:** Kullanıcının girdiği anahtar kelimelere göre sistemdeki kitap ve yazar verileri arasında filtreleme yapar. Kitap adı veya yazar ismiyle eşleşen sonuçlar bir liste halinde kullanıcıya sunulur.

6. **Takip Etme**
   - **API Metodu:** `POST /users/follow`
   - **Açıklama:** Bir kullanıcının başka bir kullanıcıyı takip listesine eklemesini sağlar. Bu işlem veritabanında iki kullanıcı arasında yeni bir sosyal etkileşim ilişkisi tanımlar.

7. **Hesap Silme**
   - **API Metodu:** `DELETE /users/{userId}`
   - **Açıklama:** Kullanıcının sistemdeki varlığını tamamen sonlandırmasına ve tüm verilerinin kalıcı olarak temizlenmesine olanak tanır. Bu işlem geri alınamaz ve güvenlik doğrulaması (giriş yapmış olma) gerektirir.