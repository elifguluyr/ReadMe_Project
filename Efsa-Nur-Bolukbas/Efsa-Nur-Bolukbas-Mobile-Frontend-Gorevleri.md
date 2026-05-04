# Efsa Nur Bölükbaş'ın Mobil Frontend Görevleri
**Mobile Front-end Demo Videosu:** (https://youtube.com/shorts/qq99UhRzx8A)

## 1. Kitap Listeleme Ekranı
- **API Endpoint:** `GET /books`
- **Görev:** Mobil uygulamada kitapların listelendiği ekran tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Kitap kartları
  - Kitap kapağı görseli
  - Liste görünümü
  - Loading indicator
  - Boş liste mesajı
- **Kullanıcı Deneyimi:**
  - Sayfa açıldığında kitapların otomatik yüklenmesi
  - Veri yüklenirken loading gösterilmesi
  - Kitap bulunamadığında kullanıcıya mesaj gösterilmesi
  - Kitapların düzenli ve okunabilir şekilde listelenmesi
- **Teknik Detaylar:**
  - React Native FlatList kullanımı
  - State management: `books`, `isLoading`
  - `bookAPI.getAllBooks()` ile backend bağlantısı
  - Error handling ve console log kullanımı

## 2. Raf Ekleme Ekranı / Akışı
- **API Endpoint:** `POST /shelves`
- **Görev:** Kullanıcının yeni raf oluşturmasını sağlayan mobil arayüzün tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Raf adı input alanı
  - "Raf Ekle" butonu
  - Loading indicator
  - Başarılı işlem mesajı
  - Hata mesajı alanı
- **Kullanıcı Deneyimi:**
  - Kullanıcı raf adını girer
  - Butona bastığında backend'e istek gönderilir
  - Başarılı işlem sonrası yeni raf ekranda görünür
  - Boş raf adı girildiğinde işlem engellenir
- **Teknik Detaylar:**
  - Form state yönetimi
  - `shelfAPI.createShelf(name)` fonksiyonu ile servis çağırma
  - Keyboard dismiss kullanımı
  - Error ve loading state yönetimi

## 3. Rafa Kitap Ekleme Ekranı / Akışı
- **API Endpoint:** `POST /shelves/{shelfId}/books`
- **Görev:** Kullanıcının seçtiği kitabı seçili rafa eklemesini sağlayan mobil arayüzün tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Kitap seçme alanı
  - Raf seçme alanı
  - "Rafa Ekle" butonu
  - Kitap kartı görünümü
  - Başarılı işlem bildirimi
- **Kullanıcı Deneyimi:**
  - Kullanıcı bir kitap seçer
  - Kitabın ekleneceği raf belirlenir
  - Butona basıldığında kitap backend üzerinden rafa eklenir
  - İşlem sonrası kitap ilgili rafta görüntülenir
- **Teknik Detaylar:**
  - Dinamik `shelfId` kullanımı
  - Kitap verisini `bookData` olarak gönderme
  - `shelfAPI.addBookToShelf(shelfId, bookData)` fonksiyonu ile istek atma
  - State güncelleme ve ekran yenileme

## 4. Raftan Kitap Silme Akışı
- **API Endpoint:** `DELETE /shelves/{shelfId}/books/{bookId}`
- **Görev:** Kullanıcının seçtiği kitabı raftan silebilmesi için mobil UI akışı tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Raf içerisindeki kitap listesi
  - Kitap kartı
  - "Sil" butonu
  - Onay dialog'u
  - Başarılı silme bildirimi
- **Kullanıcı Deneyimi:**
  - Kullanıcı raftaki kitabı seçer
  - Silme butonuna basar
  - Onay sonrası backend'e DELETE isteği gönderilir
  - Başarılı işlem sonrası kitap raftan kaldırılır
- **Teknik Detaylar:**
  - `shelfId` ve `bookId` değerleri ile dinamik endpoint oluşturma
  - `shelfAPI.removeBookFromShelf(shelfId, bookId)` fonksiyonu kullanımı
  - Destructive action için confirmation dialog
  - Error handling ve UI güncelleme

## 5. Puan Ekleme Ekranı / Akışı
- **API Endpoint:** `POST /ratings`
- **Görev:** Kullanıcının kitaba puan verebilmesini sağlayan mobil arayüz tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Puan seçme alanı
  - Yıldız veya sayı bazlı puanlama görünümü
  - "Puan Ekle" butonu
  - Loading indicator
  - Başarılı işlem mesajı
- **Kullanıcı Deneyimi:**
  - Kullanıcı kitaba puan verir
  - Butona bastığında puan backend'e gönderilir
  - Başarılı işlem sonrası puan ekranda görünür
  - Hatalı durumda kullanıcıya mesaj gösterilir
- **Teknik Detaylar:**
  - `ratingAPI.addRating(bookId, rating)` fonksiyonu kullanımı
  - Form/state yönetimi
  - Authorization token ile korumalı istek gönderimi
  - Error ve loading state yönetimi

## 6. Puan Güncelleme Ekranı / Akışı
- **API Endpoint:** `PUT /ratings/{ratingId}`
- **Görev:** Kullanıcının daha önce verdiği puanı güncellemesini sağlayan mobil arayüz tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Mevcut puan gösterimi
  - Yeni puan seçme alanı
  - "Puanı Güncelle" butonu
  - Başarılı güncelleme mesajı
  - Hata mesajı alanı
- **Kullanıcı Deneyimi:**
  - Kullanıcı mevcut puanı değiştirir
  - Güncelle butonuna basar
  - Backend'e PUT isteği gönderilir
  - Başarılı işlem sonrası yeni puan ekranda gösterilir
- **Teknik Detaylar:**
  - Dinamik `ratingId` kullanımı
  - `ratingAPI.updateRating(ratingId, rating)` fonksiyonu ile servis çağırma
  - State güncelleme
  - Error handling ve kullanıcı bildirimi

## 7. Puan Silme Akışı
- **API Endpoint:** `DELETE /ratings/{ratingId}`
- **Görev:** Kullanıcının daha önce verdiği puanı silebilmesini sağlayan mobil UI akışı tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Mevcut puan gösterimi
  - "Puanı Sil" butonu
  - Onay dialog'u
  - Başarılı silme bildirimi
- **Kullanıcı Deneyimi:**
  - Kullanıcı puanı silmek istediğinde onay dialog'u gösterilir
  - Onay sonrası backend'e DELETE isteği gönderilir
  - Başarılı işlem sonrası puan ekrandan kaldırılır
  - Hata durumunda kullanıcıya bilgilendirme yapılır
- **Teknik Detaylar:**
  - `ratingAPI.deleteRating(ratingId)` fonksiyonu kullanımı
  - Dinamik endpoint yönetimi
  - Destructive action için confirmation dialog
  - UI state güncelleme ve error handling
