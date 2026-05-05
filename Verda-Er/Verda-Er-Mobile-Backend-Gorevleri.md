# Verda Er'in Mobil Backend Entegrasyon Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]



## 1. Paylaşım Oluşturma ve Yönetimi Servisi
- **API Endpoint:** `POST /posts`
- **Görev:** Mobil cihazdan gelen yeni gönderi verilerinin veritabanına kaydedilmesi ve doğrulanması.
- **İşlevler:**
  - Kullanıcının gönderdiği metin içeriğini ve varsa görsel verilerini işleme.
  - JWT (JSON Web Token) üzerinden kimlik doğrulama kontrolü.
  - MongoDB üzerinde yeni bir "Post" dokümanı oluşturma.
  - Hata durumlarını yakalama (401 Unauthorized, 400 Bad Request).
- **Teknik Detaylar:**
  - Mongoose şeması üzerinden veri validasyonu.
  - Bearer Token kontrolü için Middleware kullanımı.
  - Başarılı işlem sonrası oluşturulan post verisinin response olarak dönülmesi.



## 2. Dinamik Sosyal Akış Servisi
- **API Endpoint:** `GET /api/paylasim`
- **Görev:** Platformdaki tüm paylaşımları ilişkili kullanıcı verileriyle birlikte kronolojik sırayla getirme.
- **İşlevler:**
  - `posts` koleksiyonunu `users` koleksiyonu ile ilişkilendirerek (Population) veri çekme.
  - Paylaşımları en yeniden en eskiye doğru (descending) sıralama.
  - Mobil uygulamanın ana akışını besleyecek JSON formatında veri dönme.
- **Teknik Detaylar:**
  - Veritabanı sorgu optimizasyonu.
  - Kullanıcı profil bilgilerinin (ad, soyad, fotoğraf) gönderi verisine dahil edilmesi.
  - Hata yönetimi (500 Internal Server Error, 404 Not Found).



## 3. Yorum İşlemleri ve Hiyerarşik Veri Servisi
- **API Endpoints:** 
  - `POST /posts/{postId}/comments`
  - `GET /posts/{postId}/comments`
  - `PUT /posts/{postId}/comments/{commentId}`
- **Görev:** Paylaşımlara ait yorumların hiyerarşik bir yapıda yönetilmesi ve güncellenmesi.
- **İşlevler:**
  - Belirli bir `postId` altındaki yorumları filtreleme ve listeleme.
  - Mevcut yorumun içeriğini sadece sahibi tarafından güncellenebilir şekilde düzenleme (PUT).
  - Yorumun ait olduğu ana gönderi ile bağının doğrulanması.
- **Teknik Detaylar:**
  - Sub-document veya referans bazlı yorum yapısı yönetimi.
  - Güvenlik kontrolü (Ownership check) ile yetkisiz güncellemelerin engellenmesi.



## 4. Etkileşim ve Veri Temizleme Servisleri
- **API Endpoints:** 
  - `POST /posts/{postId}/likes`
  - `DELETE /posts/{postId}/comments/{commentId}`
  - `DELETE /posts/{postId}`
- **Görev:** Beğeni kayıtlarının sisteme işlenmesi ve içeriklerin sistemden güvenli bir şekilde kaldırılması.
- **İşlevler:**
  - Bir gönderinin beğeni durumunu (Like/Unlike) sisteme kaydetme.
  - Paylaşım silindiğinde, veritabanı bütünlüğü için o paylaşıma ait yorumların ve beğenilerin de temizlenmesi.
  - Silme işlemlerinde mülkiyet doğrulaması yaparak güvenli silme akışı sağlama.
- **Teknik Detaylar:**
  - MongoDB `findByIdAndDelete` ve toplu silme (Cascade delete) mantığının uygulanması.
  - Beğeni sayacı yönetimi ve anlık veritabanı güncellemeleri.