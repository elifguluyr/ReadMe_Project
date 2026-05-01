# Efsa Nur Bölükbaş'ın Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Kitaplık ve Raf Yönetimi Servisi
- **API Endpoint:** `POST /shelves`, `POST /shelves/{shelfId}/books`, `DELETE /shelves/{shelfId}/books/{bookId}`
- **Görev:** Mobil uygulamada kullanıcının raf oluşturmasını, kitap eklemesini ve silmesini sağlayan servis entegrasyonlarının gerçekleştirilmesi
- **İşlevler:**
  - JWT token üzerinden kimlik doğrulama (`req.auth._id` kullanımı)
  - `POST /shelves`: Yeni raf oluşturup kullanıcının `shelf` referans dizisine MongoDB üzerinden ekleme yapılması
  - `POST /shelves/{shelfId}/books`: Google Books API'den gelen kitabın yerel veritabanında (Local DB) olup olmadığını kontrol etme, yoksa yeni `Book` modeli oluşturma ve rafa entegre etme (googleId ile benzersizlik kontrolü)
  - `DELETE /shelves/{shelfId}/books/{bookId}`: Seçili kitabı rafın kitaplar listesinden (`$pull` operatörü ile) çıkarma ve anlık silme işlemini yapma
- **Teknik Detaylar:**
  - HTTP Client kullanımı (Axios) ile Backend'e bağlanma
  - Request body ve URL parametrelerinin işlenerek controller metodlarına aktarımı
  - Mongoose `findOneAndUpdate` optimizasyonlarıyla `CastError` bug'larının çözülmesi
  - Error handling mekanizması (404 Not Found, 400 Bad Request, 500 Internal Server Error) ve bu hataların mobil tarafa fırlatılması

## 2. Kitap Puanlama (Rating) Servisi
- **API Endpoint:** `GET /ratings/user`, `POST /ratings`, `PUT /ratings/{ratingId}`, `DELETE /ratings/{ratingId}`
- **Görev:** Kullanıcının kitaplara verdiği puanların CRUD (Create, Read, Update, Delete) işlemlerini uçtan uca gerçekleştiren servis entegrasyonu
- **İşlevler:**
  - `GET /ratings/user`: Kullanıcının geçmişte verdiği tüm puanları getirip mobil uygulamanın state'ine kaydetme
  - `POST /ratings`: Kitaba verilen yeni 1-5 arası yıldızı API'ye POST isteğiyle kaydetme
  - `PUT /ratings/{ratingId}`: Önceden verilmiş bir puanı yeni değerle değiştirme (Update)
  - `DELETE /ratings/{ratingId}`: Mevcut puanlamayı sistemden tamamen silme (Delete)
- **Teknik Detaylar:**
  - Axios interceptor üzerinden tüm servislere otomatik `Authorization (Bearer Token)` header'ının eklenmesi
  - Token süresi veya yetkisizlik durumlarında (401 Unauthorized) ile backend endpoint bulunamama (404 Not Found) durumlarında `try-catch` blokları ile güvenli hata yönetimi
  - Yanıt (response) verilerinin parse edilip, frontend tarafındaki modal içerisinde aktif yıldızlara dinamik olarak dönüştürülmesi

## 3. Küresel Kitap Arama (Google Books API) Servisi
- **API Endpoint:** `GET /books/search?q={query}`
- **Görev:** Mobil uygulamadan girilen kelimeleri Google Books API üzerinden aratıp sonuçları döndüren aracı servis (proxy) bağlantısının kurulması
- **İşlevler:**
  - Arama çubuğundan gelen veriyi URL kodlaması (`encodeURIComponent`) ile backend'e güvenli olarak iletme
  - Backend üzerinden dönen karmaşık kitap datalarını (id, başlık, yazarlar, kapak resmi vb.) mobil tarafta kullanılabilir, temizlenmiş bir formata (`map`) getirme
  - İstek sırasında uygulamanın "Loading" statüsünü yönetme
- **Teknik Detaylar:**
  - Asenkron veri akışı (Promise yapısı ve async/await kullanımı)
  - Google Books veri modelini MongoDB `Book` modeline uyarlama ve property formatlarını sabitleme
  - API'den yanıt gelmemesi veya Timeout durumlarında Request/Response döngüsünün yakalanması
