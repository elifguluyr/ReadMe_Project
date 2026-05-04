# Efsa Nur Bölükbaş'ın Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** (https://youtu.be/Kjxd4wspJ2w)

## 1. Kitap Listeleme Servisi
- **API Endpoint:** `GET /books`
- **Görev:** Mobil uygulamada sistemde kayıtlı kitapları listeleyen servis entegrasyonu
- **İşlevler:**
  - Mobil uygulamadan kitap listesini çekme
  - API'ye GET isteği gönderme
  - Gelen kitap verilerini liste formatında kullanma
  - Kitap başlığı, yazar ve kapak görseli gibi bilgileri alma
  - Hata durumlarını yakalama ve kullanıcıya gösterme
- **Teknik Detaylar:**
  - Axios HTTP client kullanımı
  - `bookAPI.getAllBooks()` fonksiyonu ile istek gönderme
  - Response verisini parse etme
  - Loading state ve error handling yönetimi

## 2. Raf Ekleme Servisi
- **API Endpoint:** `POST /shelves`
- **Görev:** Mobil uygulamada kullanıcının yeni raf oluşturmasını sağlayan servis entegrasyonu
- **İşlevler:**
  - Kullanıcıdan raf adı bilgisini alma
  - API'ye POST isteği gönderme
  - Başarılı raf ekleme sonrası raf listesini güncelleme
  - Hata durumlarını yakalama
- **Teknik Detaylar:**
  - JWT token ile kimlik doğrulama
  - Authorization header ekleme
  - Request body oluşturma: `{ name }`
  - `shelfAPI.createShelf(name)` fonksiyonu ile servis çağırma

## 3. Rafa Kitap Ekleme Servisi
- **API Endpoint:** `POST /shelves/{shelfId}/books`
- **Görev:** Seçilen kitabı kullanıcının belirlediği rafa ekleyen servis entegrasyonu
- **İşlevler:**
  - Seçilen rafın ID bilgisini alma
  - Eklenecek kitap bilgilerini toplama
  - API'ye POST isteği gönderme
  - Başarılı işlem sonrası kitabı ilgili rafta gösterme
- **Teknik Detaylar:**
  - Dinamik endpoint kullanımı
  - Request body olarak kitap verisi gönderme
  - `shelfAPI.addBookToShelf(shelfId, bookData)` fonksiyonu ile istek atma
  - Error handling ve kullanıcı bildirimi

## 4. Raftan Kitap Silme Servisi
- **API Endpoint:** `DELETE /shelves/{shelfId}/books/{bookId}`
- **Görev:** Kullanıcının seçtiği kitabı ilgili raftan silen servis entegrasyonu
- **İşlevler:**
  - Silinecek raf ve kitap ID bilgisini alma
  - API'ye DELETE isteği gönderme
  - Başarılı silme sonrası raf içeriğini güncelleme
  - Kullanıcıya işlem sonucunu gösterme
- **Teknik Detaylar:**
  - Dinamik endpoint kullanımı
  - `shelfAPI.removeBookFromShelf(shelfId, bookId)` fonksiyonu ile servis çağırma
  - JWT token ile korumalı endpoint kullanımı
  - Error handling yönetimi

## 5. Puan Ekleme Servisi
- **API Endpoint:** `POST /ratings`
- **Görev:** Kullanıcının bir kitaba puan vermesini sağlayan servis entegrasyonu
- **İşlevler:**
  - Kitap ID ve puan bilgisini alma
  - API'ye POST isteği gönderme
  - Başarılı işlem sonrası puanı ekranda gösterme
  - Hata durumlarını yakalama
- **Teknik Detaylar:**
  - Request body oluşturma: `{ bookId, rating }`
  - `ratingAPI.addRating(bookId, rating)` fonksiyonu ile servis çağırma
  - Authorization header ile token gönderme
  - Loading ve error state yönetimi

## 6. Puan Güncelleme Servisi
- **API Endpoint:** `PUT /ratings/{ratingId}`
- **Görev:** Kullanıcının daha önce verdiği puanı güncellemesini sağlayan servis entegrasyonu
- **İşlevler:**
  - Güncellenecek puan ID bilgisini alma
  - Yeni puan değerini API'ye gönderme
  - Başarılı güncelleme sonrası ekrandaki puanı yenileme
  - Hata durumlarını kullanıcıya bildirme
- **Teknik Detaylar:**
  - Dinamik endpoint kullanımı
  - Request body oluşturma: `{ rating }`
  - `ratingAPI.updateRating(ratingId, rating)` fonksiyonu ile PUT isteği gönderme
  - Error handling yönetimi

## 7. Puan Silme Servisi
- **API Endpoint:** `DELETE /ratings/{ratingId}`
- **Görev:** Kullanıcının verdiği puanı silmesini sağlayan servis entegrasyonu
- **İşlevler:**
  - Silinecek puan ID bilgisini alma
  - API'ye DELETE isteği gönderme
  - Başarılı silme sonrası puanı ekrandan kaldırma
  - Hata durumlarını yakalama
- **Teknik Detaylar:**
  - JWT token ile kimlik doğrulama
  - `ratingAPI.deleteRating(ratingId)` fonksiyonu ile servis çağırma
  - Dinamik endpoint yapısı
  - Error handling ve kullanıcı bildirimi
