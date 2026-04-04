# Verda Er'in Web Frontend Görevleri
**Front-end Test Videosu: (https://www.youtube.com/watch?v=7uefincb6Kg)

## 1. Yeni Paylaşım Oluşturma Sayfası
- **API Endpoint:** `POST /posts`
- **Görev:** Kullanıcının sistem üzerinde yeni bir gönderi (metin/görsel) oluşturması için web arayüzü tasarımı.
- **UI Bileşenleri:**
  - Responsive paylaşım formu (Card layout)
  - Metin içeriği için genişleyebilir textarea (placeholder: "Ne düşünüyorsun?")
  - "Paylaş" butonu (Primary button style)
  - Karakter sayacı (Real-time character count)
  - Dosya/Görsel yükleme ikonu (Upload icon)
- **Form Validasyonu:**
  - İçerik boş bırakılamaz (Required validation)
  - Maksimum 500 karakter sınırı
  - Sadece giriş yapmış kullanıcılar formu görebilir
- **Kullanıcı Deneyimi:**
  - Paylaşım sırasında loading spinner gösterimi
  - Başarılı paylaşım sonrası "Paylaşıldı" Toast mesajı ve akışın yenilenmesi

## 2. Gönderiye Yorum Yapma Modülü
- **API Endpoint:** `POST /posts/{postId}/comments`
- **Görev:** Belirli bir paylaşımın altına yeni bir yorum eklenmesi için interaktif alan tasarımı.
- **UI Bileşenleri:**
  - Post kartı altında inline yorum inputu
  - Küçük profil avatarı (Current user avatar)
  - "Gönder" ikonu veya butonu
- **Form Validasyonu:**
  - Boş yorum gönderilemez kontrolü
  - HTML5 form validation (required attribute)
- **Kullanıcı Deneyimi:**
  - Optimistic update (Yorumun anında listede belirmesi)
  - Hata durumunda "Yorum iletilemedi, tekrar deneyin" uyarısı

## 3. Paylaşım Beğenme (Like) Etkileşimi
- **API Endpoint:** `POST /posts/{postId}/likes`
- **Görev:** Paylaşımların beğenilmesi ve beğeninin geri çekilmesi (Toggle) işlemi.
- **UI Bileşenleri:**
  - Kalp (Heart) veya Beğeni ikonu
  - Dinamik beğeni sayısı (Counter label)
  - Aktif/Pasif durumuna göre ikon renk değişimi (Red/Blue)
- **Kullanıcı Deneyimi:**
  - İkona tıklandığında pürüzsüz renk geçişi (Smooth transition)
  - Beğeni sayısının sayfa yenilenmeden güncellenmesi

## 4. Yorum Güncelleme ve Düzenleme Arayüzü
- **API Endpoint:** `PUT /posts/{postId}/comments/{commentId}`
- **Görev:** Kullanıcının daha önce yaptığı bir yorumu düzenleyebilmesi.
- **UI Bileşenleri:**
  - Yorum sağında "Düzenle" (Edit) seçeneği
  - Düzenleme modunda inputa dönüşen yorum alanı
  - "Kaydet" ve "İptal" butonları
- **Kullanıcı Deneyimi:**
  - Sadece yorum sahibine özel düzenleme butonunun gösterilmesi
  - Başarılı güncelleme sonrası inline bildirim

## 5. Yorumları Listeleme Görünümü
- **API Endpoint:** `GET /posts/{postId}/comments`
- **Görev:** Bir paylaşıma ait tüm yorumların tarih sırasına göre görüntülenmesi.
- **UI Bileşenleri:**
  - Kaydırılabilir yorum listesi (Scrollable list)
  - Her yorum için yazar adı ve paylaşım tarihi (Timestamp)
  - Yorumlar için ayrılmış alt panel (Comment section)
- **Kullanıcı Deneyimi:**
  - Yorumlar yüklenirken skeleton loader kullanımı
  - Boş yorum listesi için "İlk yorumu siz yapın" mesajı

## 6. Ana Akış (Paylaşımları Listeleme) Sayfası
- **API Endpoint:** `GET /api/paylasim`
- **Görev:** Platformdaki tüm paylaşımların kronolojik olarak listelenmesi.
- **UI Bileşenleri:**
  - Responsive Feed layout (Desktop: Center column, Mobile: Full width)
  - Paylaşım kartları (User info, content, action buttons)
  - Veri yüklenirken Loading skeleton screen
- **Kullanıcı Deneyimi:**
  - En güncel paylaşımların en üstte konumlanması
  - Akıcı kaydırma (Smooth scrolling) desteği

## 7. Yorum Silme İşlemi Akışı
- **API Endpoint:** `DELETE /posts/{postId}/comments/{commentId}`
- **Görev:** Kullanıcının kendi yorumunu sistemden kalıcı olarak kaldırması.
- **UI Bileşenleri:**
  - Silme ikonu (Trash icon)
  - Confirmation Modal (Emin misiniz? uyarısı)
- **Kullanıcı Deneyimi:**
  - Silme işlemi sırasında loading indicator
  - Başarılı silme sonrası yorumun listeden fade-out animasyonu ile kalkması

## 8. Paylaşım Silme Mekanizması
- **API Endpoint:** `DELETE /posts/{postId}`
- **Görev:** Kullanıcının paylaştığı bir gönderiyi ve bağlı verileri kaldırması.
- **UI Bileşenleri:**
  - Post sağ üst köşesinde silme butonu
  - Kritik işlem uyarısı içeren modal dialog
  - "Silmeyi Onayla" butonu (Danger button style)
- **Kullanıcı Deneyimi:**
  - Yıkıcı işlem bildirimi ("Bu işlem geri alınamaz")
  - Silme sonrası ana akıştan ilgili postun anında çıkarılması