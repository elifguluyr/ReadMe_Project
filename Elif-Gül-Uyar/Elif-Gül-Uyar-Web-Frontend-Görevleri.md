# Elif Gül Uyar'ın Web Frontend Görevleri

**Front-end Test Videosu:** [youtube video linki](https://youtu.be/vM43QKzg0ME)

## 1. Ana Sayfa (Home) 
- **API Endpoints:** `GET /posts`, `GET /books/popular` (Kullanım senaryosuna göre)
- **Görev:** Kullanıcıların platforma girdiklerinde karşılaştıkları ana akışın ve kitap/paylaşım dinamiklerinin UI implementasyonu
- **UI Bileşenleri:**
  - Responsive ana sayfa grid yapısı (Feed akışı ve yan menüler)
  - Dinamik Navigation Bar (Giriş yapmış kullanıcıya özel menüler, avatar)
  - Paylaşım (Post) oluşturma alanı (Giriş yapılmışsa aktif)
  - Diğer kullanıcıların paylaşımlarının listelendiği akış (Feed) kartları
  - Kitap veya popüler içeriklerin sergilendiği ufak vitrin alanları
  - Skeleton loading (Veriler API'den gelirken gösterilen yükleme animasyonları)
- **Kullanıcı Deneyimi (UX):**
  - Akıcı kaydırma (Smooth scrolling) ve modern hover efektleri
  - "Beğen" veya "Yorum Yap" gibi etkileşimlerde anında görsel geri bildirim (Optimistic UI)
  - Mobil cihazlarda alt navigasyon veya hamburger menüye dönüşen responsive yapı
  - API'den veri geç gelirse kullanıcıyı sıkmayan boş durum (Empty State) tasarımları
- **Teknik Detaylar:**
  - State Management (Global kullanıcı durumu ve anlık post akışı kontrolü)
  - Gecikmeli yükleme (Lazy loading) ile performans optimizasyonu
  - Yetki kontrolü (Kullanıcı giriş yapmamışsa bazı butonların Login sayfasına yönlendirmesi)

---

## 2. Üye Olma (Register) Sayfası
- **API Endpoint:** `POST /auth/signup`
- **Görev:** Yeni kullanıcıların sisteme güvenli ve akıcı bir UI ile kayıt olmasını sağlama
- **UI Bileşenleri:**
  - Tasarım odaklı, responsive kayıt formu (Card veya Split-screen layout)
  - Ad ve Soyad (firstName, lastName) input alanları
  - Email input alanı (type="email")
  - Şifre ve Şifre Tekrar input alanları (Göz ikonu ile şifreyi göster/gizle özelliği)
  - "Kayıt Ol" butonu (Tıklanma anında yükleme spinner'ı içeren primary buton)
  - "Zaten hesabınız var mı? Giriş Yap" yönlendirme linki
- **Form Validasyonu:**
  - Canlı (Real-time) veri doğrulama
  - Geçerli email formatı kontrolü (Regex pattern)
  - Şifre güçlülük kuralları (Minimum karakter limiti) ve şifrelerin eşleşme kontrolü
  - Tüm zorunlu alanlar doğru formatta dolmadan "Kayıt Ol" butonunun pasif (disabled) kalması
- **Kullanıcı Deneyimi (UX):**
  - Hata durumlarının ilgili inputun hemen altında (inline validation) zarifçe gösterilmesi
  - Başarılı kayıt sonrası "Hoş Geldiniz" bildirimi (Toast/Snackbar) ve Login'e otomatik yönlendirme
  - Çift tıklama (Double-click) koruması ile aynı anda iki kez form gönderiminin engellenmesi
- **Teknik Detaylar:**
  - Axios ile Backend'e güvenli veri iletimi
  - React Hook Form veya kontrollü state yapıları ile form yönetimi
  - Backend'den dönen 409 (Email zaten var) gibi hataların yakalanıp kullanıcıya gösterilmesi

---

## 3. Giriş Yap (Login) Sayfası
- **API Endpoint:** `POST /auth/login`
- **Görev:** Mevcut kullanıcıların JWT token alarak sisteme güvenli şekilde giriş yapmalarının UI entegrasyonu
- **UI Bileşenleri:**
  - Temiz ve odaklanılabilir giriş formu tasarımı
  - Email ve Şifre input alanları
  - "Şifremi Unuttum" linki (Opsiyonel gelecek vizyonu için)
  - "Giriş Yap" butonu (İşlem anında loading state)
  - "Hesabın yok mu? Kayıt Ol" yönlendirme linki
- **Form Validasyonu:**
  - Email ve şifre alanlarının boş bırakılamaması (HTML5 + Client-side doğrulama)
  - Hatalı giriş denemelerinde (Yanlış şifre/email) güvenlik odaklı genel hata mesajları (Örn: "Giriş bilgileri hatalı")
- **Kullanıcı Deneyimi (UX):**
  - Klavye dostu gezinme (Tab ile alanlar arası geçiş, Enter ile formu onaylama)
  - Yetkisiz giriş sebebiyle Login'e yönlendirilmişse, ekranda beliren "Lütfen önce giriş yapın" uyarısı
  - Başarılı giriş sonrası gecikme yaşatmadan Ana Sayfaya veya Profil'e yönlendirme
- **Teknik Detaylar:**
  - Backend'den dönen JWT (JSON Web Token) verisinin LocalStorage veya AuthContext içerisine güvenle kaydedilmesi
  - Global `isAuthenticated` durumunun anında güncellenerek uygulamanın yetkilendirilmesi
  - Axios Interceptor mimarisi için token'ın hazır hale getirilmesi

---

## 4. Kullanıcı Profil (Profile) Sayfası
- **API Endpoints:** `GET /users/{userId}`, `PUT /users/me`, `POST /users/{userId}/follow`, `DELETE /users/me`
- **Görev:** Kullanıcı profili görüntüleme, düzenleme, takip mekanizması ve hesap yönetimi işlemlerinin tek bir yapıda entegre edilmesi
- **UI Bileşenleri:**
  - Kendi profili ve diğer kullanıcıların profilleri için dinamik arayüz (Ziyaret edilen profile göre değişen butonlar).
  - Profil Kartı (Profil fotoğrafı veya varsayılan harf avatarları, gradient arka plan, isim, email).
  - Tıklanabilir "Takip Edilenler" sayısı ve detayları listeleyen özel, şık Modal penceresi.
  - Modüler içerik gezinimi için Tab Yapısı (Hakkında, Kitaplık, Gönderiler).
  - Profili Düzenle Modalı (Ad, Email, Biyografi, Şifre, Resim URL değiştirme alanları).
  - Düzenle modalı içerisine entegre edilmiş kırmızı "Hesabı Kalıcı Olarak Sil" (Danger) butonu.
- **Form Validasyonu & Kontroller:**
  - Profil güncellenirken hiçbir veri değiştirilmediyse "Kaydet" butonunun işlemsiz kalması.
  - Hesap silme işlemi öncesi JavaScript `confirm` diyaloğu ile "Emin misiniz?" çift onay mekanizması.
- **Kullanıcı Deneyimi (UX):**
  - Veri yüklenirken animasyonlu "Yükleniyor..." durumları (Pulse effect).
  - Profil bilgisi çekilemezse (Ağ hatası, silinmiş kullanıcı) kullanıcıyı karşılayan özel "Hata Ekranı" ve Tekrar Dene butonu.
  - Backend istekleri sürerken (Kaydediliyor..., Bekleniyor...) butonların pasif duruma geçip kullanıcıya bilgi vermesi.
  - Gönderi yoksa (Empty State) çıkan "İlk Gönderini Paylaş" yönlendirmesi.
- **Teknik Detaylar:**
  - React Router `useParams` ile URL'den kullanıcı ID'si alarak dinamik veri çekimi.
  - Backend'den Mongoose `.populate()` yöntemiyle gelen zengin verilerin (Takip edilenlerin isimleri ve fotoğrafları) UI'da işlenmesi.
  - Çıkış yapıldığında (veya hesap silindiğinde) AuthContext'in temizlenip Login sayfasına anında yönlendirme.