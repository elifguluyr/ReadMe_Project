# Efsa Nur Bölükbaş'ın Mobil Frontend Görevleri
**Mobile Front-end Demo Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Kitaplık (Library) Sayfası ve Raflar
- **API Endpoint:** `GET /profile/{userId}`, `GET /books`
- **Görev:** Kullanıcının daha önce oluşturduğu rafların ve o raflardaki kitapların dinamik olarak listelendiği ekranın tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Sayfa başlığı ("Kitaplığım")
  - "Yeni Raf" butonu (Üst kısımda, ikonlu)
  - Her raf için raf başlığı ve kitap sayısı göstergesi
  - Rafların hizasında "+ Kitap Ekle" butonu
  - Raf içi yatay kaydırılabilir (Horizontal ScrollView) kitap listesi
  - Kitap kapak resmi (veya placeholder renk/harf), başlık ve yazar adı
  - Kitap kapağı üzerinde "Sil (Çöp Kutusu)" butonu
- **Kullanıcı Deneyimi:**
  - Veriler yüklenirken ActivityIndicator (Loading state) gösterimi
  - Raf boşsa "Bu rafta henüz kitap yok" şeklinde Empty State uyarısı
  - Kitap sil butonuna basıldığında yanlışlıkla silmeleri önlemek için onay diyalog (Alert) penceresi çıkarılması
- **Teknik Detaylar:**
  - Platform: React Native / Expo
  - Horizontal FlatList/ScrollView kullanımı
  - AsyncStorage ile userId kontrolü ve güvenliği
  - useEffect ile sayfa açılışında API verilerinin toplu (Promise.all) çekilmesi

## 2. Yeni Raf Ekleme Modalı
- **API Endpoint:** `POST /shelves`
- **Görev:** Kullanıcının kitaplığına yeni bir raf eklemesini sağlayan modal (popup) ekranının tasarımı ve implementasyonu
- **UI Bileşenleri:**
  - Saydam (Transparent) arka planlı Modal
  - Raf adı için TextInput alanı
  - "İptal" ve "Ekle" butonları
- **Form Validasyonu:**
  - Raf adı boş girilemez kontrolü (boşsa istek atılmaz)
- **Kullanıcı Deneyimi:**
  - Fade animasyonu ile açılıp kapanan pürüzsüz modal deneyimi
  - Başarılı ekleme sonrası modalın otomatik kapanması ve rafların anında yenilenmesi (UI update)
  - Hata durumunda Alert ile kullanıcı uyarısı
- **Teknik Detaylar:**
  - State management (modal görünürlüğü, input state'i)
  - React Native Modal component kullanımı

## 3. Rafa Kitap Ekleme (Global Arama) Modalı
- **API Endpoint:** `GET /books/search?q={query}`, `POST /shelves/{shelfId}/books`
- **Görev:** Kullanıcının dünyadaki herhangi bir kitabı Google Books üzerinden aratıp doğrudan seçtiği rafa eklemesini sağlayan tam ekran arama arayüzünün tasarımı
- **UI Bileşenleri:**
  - Tam ekran (Full Screen) Modal yapısı
  - Üst kısımda "Geri" ikonu ve "Arama" input alanı
  - Arama sonuçlarını listeleyen dikey FlatList
  - Her arama sonucu için: Kitap kapağı, başlık, yazar bilgileri ve "Rafa Ekle" butonu
- **Kullanıcı Deneyimi:**
  - Sayfa açıldığında arama kutusuna otomatik odaklanma (autoFocus)
  - Arama tuşuna (Enter/Search) basıldığında klavyenin otomatik gizlenmesi (Keyboard.dismiss)
  - Arama işlemi esnasında loading spinner gösterimi
  - Sonuç bulunamazsa veya ilk açılışta kullanıcıya yönlendirici bilgi mesajı (Empty state) gösterimi
- **Teknik Detaylar:**
  - Google Books API sonuçlarının gerçek zamanlı UI uyarlaması
  - Keyboard ve Scroll event yönetimi
  - Seçili raf ID'sinin (selectedShelfForAdd) state üzerinde tutularak arama sonuçlarına aktarılması

## 4. Kitap Puanlama (Rating) Modalı
- **API Endpoint:** `POST /ratings`, `PUT /ratings/{ratingId}`, `DELETE /ratings/{ratingId}`
- **Görev:** Kullanıcının rafındaki bir kitaba 1-5 arası yıldız vermesini ve yönetmesini sağlayan detaylı ekran tasarımı
- **UI Bileşenleri:**
  - Alttan kayarak açılan (Slide Animation) Modal tasarımı
  - Kitabın büyük kapak resmi, başlığı ve yazarı
  - 5 adet seçilebilir Yıldız (Star) ikonu dizilimi
  - Modal kapatma (X) butonu
- **Kullanıcı Deneyimi:**
  - Verilen yıldıza göre sarı/gri ikon değişimi (real-time feedback)
  - Aynı puana ikinci kez tıklandığında puanın tamamen silinmesi
  - Farklı puana tıklandığında anında güncellenmesi
  - Başarılı işlemlerde (Eklendi, Silindi, Güncellendi) Alert ile native sistem geri bildirimleri
- **Teknik Detaylar:**
  - Daha önce verilmiş puanların Modal açılırken arka planda filtrelenip (find) UI'da aktif yıldız olarak yansıtılması
  - Dinamik render operasyonları (Dynamic rendering of stars based on currentRating state)
