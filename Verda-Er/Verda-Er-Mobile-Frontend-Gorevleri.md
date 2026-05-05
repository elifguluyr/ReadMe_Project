# Verda Er'in Mobil Frontend Görevleri
**Mobile Front-end Demo Videosu:** [Link buraya eklenecek]



## 1. Paylaşım Yapma (Post Creation)
- **API Endpoint:** `POST /posts`
- **Görev:** Kullanıcının sistem üzerinde yeni bir gönderi (metin, görsel vb.) oluşturmasını sağlayan arayüzün tasarımı ve implementasyonu.
- **UI Bileşenleri:**
  - Metin giriş alanı (Multiline input)
  - Paylaş butonu ve vazgeçme seçeneği
  - İşlem sırasında Loading Indicator
- **Teknik Detaylar:**
  - Kullanıcının sisteme giriş yapmış olması (Auth check) gerekir.
  - Başarılı paylaşım sonrası ana akışa otomatik yönlendirme.



## 2. Sosyal Akış ve Listeleme (Feed & Listing)
- **API Endpoint:** `GET /api/paylasim`
- **Görev:** Platformdaki tüm paylaşımların, kullanıcı profil bilgileriyle beraber kronolojik sırayla listelenmesi.
- **UI Bileşenleri:**
  - Kart tabanlı tasarım (Adaçayı yeşili, toprak tonları ve ahşap dokulu kartlar).
  - Pull-to-refresh özelliği (Dinamik akış yenileme).
  - Kullanıcı profil bilgileri ve gönderi detay alanı.
- **Kullanıcı Deneyimi:**
  - Akıcı kaydırma (Smooth scroll) ve optimize edilmiş görsel yükleme.



## 3. Yorum Yönetimi (Ekleme, Listeleme ve Güncelleme)
- **API Endpoints:**
  - `POST /posts/{postId}/comments` (Ekleme)
  - `GET /posts/{postId}/comments` (Listeleme)
  - `PUT /posts/{postId}/comments/{commentId}` (Güncelleme)
- **Görev:** Belirli bir paylaşıma yeni yorum ekleme, mevcut yorumları listeleme ve düzenleme yeteneklerinin sağlanması.
- **Kullanıcı Deneyimi:**
  - Hiyerarşik kontrol (Yorumun doğru post altında olduğunun doğrulanması).
  - Sadece yorum sahibine özel düzenleme yetkisi.



## 4. Etkileşim ve İçerik Silme (Like & Delete)
- **API Endpoints:**
  - `POST /posts/{postId}/likes` (Beğenme)
  - `DELETE /posts/{postId}/comments/{commentId}` (Yorum Silme)
  - `DELETE /posts/{postId}` (Paylaşım Silme)
- **Görev:** Beğeni sisteminin ve kullanıcıların kendi içeriklerini sistemden kaldırma işlemlerinin yönetilmesi.
- **UI Bileşenleri:**
  - İnteraktif beğeni butonu ve sayaç göstergesi.
  - Silme işlemi öncesi onay diyaloğu (Double confirmation).
- **Teknik Detaylar:**
  - Paylaşım silindiğinde ilgili yorum ve beğenilerin temizlenmesi.
  - Güvenlik gereği sadece içerik sahibi tarafından gerçekleştirilebilir.