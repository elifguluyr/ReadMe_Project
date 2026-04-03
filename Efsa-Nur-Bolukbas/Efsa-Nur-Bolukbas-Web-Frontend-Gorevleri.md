# Efsa Nur Bölükbaş'ın Web Frontend Görevleri

Front-end Test Videosu: (https://youtu.be/w5NboEjYIao)

## 1. Kitaba Puan Verme Arayüzü (Puan Ekleme)

**API Endpoint:** `POST /api/ratings`
**Görev:** Kitap detay sayfasında kullanıcının bir kitaba ilk defa puan verebilmesi için görsel arayüzün (UI) tasarımı ve implementasyonu.

**UI Bileşenleri:**
- 5 yıldızlı interaktif puanlama bileşeni (veya benzeri ikonlar).
- Hover efekti (yıldızların üzerine gelindiğinde dolması).
- Puanlama işlemi sırasında "Loading" ikonu.
- Başarılı işlem sonrası onay/success mesajı (Toast).

**Form Validasyonu ve Kontrol:**
- Kullanıcının giriş yapıp yapmadığının kontrolü (Giriş yapmamışsa login sayfasına yönlendirme).
- Seçilen puanın 1 ile 5 arasında olduğunun kontrolü.
- Art arda istek atılmasını engellemek için buton/ikon "disabled" durumu (Debounce).
- Puan verilmeden işlem yapılamaması.

**Kullanıcı Deneyimi:**
- Optimistic update (Sunucudan yanıt beklemeden yıldızların anında dolması, hata olursa geri alınması).
- İşlem hatası durumunda 400/500 tarzı hatalarda "Puan kaydedilemedi" bildirimi.

**Teknik Detaylar:**
- State management: Kullanıcının verdiği puanın UI üzerinde anlık tutulması (`rating` stateti).
- `axios` veya `fetch` ile POST isteği atılarak Bearer token gönderimi.
- `<StarRating />` veya benzeri tekrar kullanılabilir (reusable) component tasarımı.

---

## 2. Puan Silme İşlemi Akışı

**API Endpoint:** `DELETE /api/ratings/{ratingId}`
**Görev:** Kullanıcının kitaba daha önceden verdiği puanı iptal edebilmesi (silebilmesi) için gereken UI ve akışın tasarlanması.

**UI Bileşenleri:**
- Puanlama alanının yanında "Puanı Temizle" / "Sil" butonu veya çöp kutusu ikonu.
- İşlem sırasında gösterilecek Loading spinner.
- İsteğe bağlı olarak silmeden önce küçük onay diyaloğu (Tooltip veya Modal).

**Form Validasyonu ve Kontrol:**
- Sil butonunun yalnızca kullanıcı daha önce puan vermişse görünür olması.
- Çift tıklama / üst üste tıklamaları engelleme (loading state iken butonun inaktif olması).

**Kullanıcı Deneyimi:**
- Silme işlemine tıklandığında anında yıldızların boşalması (Optimistic update).
- Başarılı silme işleminden sonra "Puanınız silindi" şeklinde Toast bildirimi.
- Hata durumunda yıldızların eski değerine geri dönmesi ve hata bildirimi.

**Teknik Detaylar:**
- Mevcut `ratingId`'nin tespit edilip DELETE fonksiyonuna parametre olarak geçilmesi.
- Global veya local state üzerinden kitap puan ortalamasının (varsa) arayüzde dinamik güncellenmesi.

---

## 3. Puan Güncelleme Arayüzü

**API Endpoint:** `PUT /api/ratings/{ratingId}`
**Görev:** Mevcut puanın üzerine tıklanarak yeni bir puan ataması yapılması işlemine dair UI tasarımı.

**UI Bileşenleri:**
- Mevcut puanı gösteren dolu yıldızlar.
- Kullanıcı farklı bir yıldıza tıkladığında değeri algılayan tıklanabilir alanlar.

**Form Validasyonu ve Kontrol:**
- Gerekli veri manipülasyonu öncesi, aynı puana (örn: zaten 4 iken 4'e) tekrar basıldıysa API'ye gereksiz istek gitmesinin (PUT) engellenmesi.
- Yeni seçilen puanın mutlaka farklı olması şartı.

**Kullanıcı Deneyimi:**
- Puan değişiminde tatmin edici, pürüzsüz animasyon (smooth transition).
- "Puanınız güncellendi" Toast mesajı ile kullanıcı bilgilendirmesi.

**Teknik Detaylar:**
- Güncelleme için mevcut `ratingId` ve body'de yeni `rating` JSON datasının aktarılması.
- API'den yanıt döndüğünde başarı grafiğinin (kullanıcının kendi pensesinde veya kitabın genel notunda) güncellenmesi.

---

## 4. Yeni Raf Oluşturma Formu

**API Endpoint:** `POST /api/shelves`
**Görev:** Kullanıcının profili veya "Raflarım" sekmesinde yeni bir kitap rafı yaratabilmesi için arayüz.

**UI Bileşenleri:**
- Sayfanın sağ üstünde veya sidebar'da dikkat çekici "Yeni Raf Oluştur" + butonu.
- Tıklandığında açılan Modal Dialog veya Accordion form.
- Raf ismi (name) input alanı.
- "Kaydet/Oluştur" (Primary) ve "İptal" (Secondary) butonları.
- Gönderim sırasında Modal üzerinde yükleniyor ibaresi.

**Form Validasyonu ve Kontrol:**
- Raf adının boş bırakılmaması (`required`).
- Raf adının maksimum / minimum karakter kontrolü (örn: max 50 karakter).
- Kurala uymadığında input altında veya sağında inline kırmızı hata mesajı.

**Kullanıcı Deneyimi:**
- Form başarıyla gönderildikten sonra Modal'ın otomatik kapanması.
- Yeni rafın, sayfa yenilenmesine gerek kalmadan listeye anında (real-time hissiyatı) eklenmesi.

**Teknik Detaylar:**
- Controller'dan gelecek `201 Created` yanıtı sonrası Frontend state dizisine yeni rafın eklenmesi.
- Erişilebilirlik: Modal açıldığında focus'un `name` input'una otomatik gelmesi, ESC tuşu ile modalın kapanabilmesi.

---

## 5. Kitabı Rafa Ekleme Modülü (Dropdown/Menu)

**API Endpoint:** `POST /api/shelves/{shelfId}/books`
**Görev:** Herhangi bir kitap listesinde ya da detayında kitabı seçili bir rafa ekleme işleminin tasarımı.

**UI Bileşenleri:**
- Kitap kapağı (kartı) üzerinde veya detayında "Rafa Ekle" butonu (Book Icon).
- Tıklandığında kullanıcının mevcut raflarını listeleyen şık bir Dropdown Menü veya Popover.
- Ekleme işlemi sırasında dropdown içerisinde Loading skeleton / spinner gösterilmesi.
- Ekli olduğu raf/rafların yanında check (tik) işareti vb. bir gösterge.

**Form Validasyonu ve Kontrol:**
- Eğer kullanıcıya ait hiç raf yoksa "Önce raf oluşturun" uyarısı çıkarmak.
- Menüdeki raflar yüklenirken "Loading Shelves..." bekleme durumu.

**Kullanıcı Deneyimi:**
- Kitap başarılı eklendiğinde "x kitabı y rafına eklendi" şeklinde Snackbar / Toast çıkartılması.
- Zaten bulunduğu bir rafta tekrar "ekle" butonuna basılmasının önlenmesi (Dropdown'da o raf inaktif/disabled görünür).

**Teknik Detaylar:**
- Bileşenin kitabın GoogleID'sini veya kendi ID'sini props olarak alıp API isteğini şekillendirmesi.
- React Portal veya Popper.js / MUI Popover kullanarak dropdown menünün sayfa dışına taşmasını engelleme.

---

## 6. Raftan Kitap Silme Akışı

**API Endpoint:** `DELETE /api/shelves/{shelfId}/books/{bookId}`
**Görev:** Kullanıcının, seçili rafından bir kitabı çıkarmak istediğindeki (Silme işlemi) detaylı web UI akışı.

**UI Bileşenleri:**
- "Raflarım" sayfasında kitabın üzerinde görünen (Hover durumunda beliren) "Raftan Kaldır" (Trash/Minus ikonu).
- Destructive (Yıkıcı) bir işlem olduğu için küçük bir Confirmation Dialog (Onay Penceresi).
- Onaylama durumunda çalışacak Kırmızı (Danger) ve İptal (Secondary) butonları.

**Form Validasyonu ve Kontrol:**
- Silme isteği gitmeden backend id'lerinin (Hem raf, hem kitap ID) var olduğunun kontrolleri.

**Kullanıcı Deneyimi:**

- İşlem tamamlandığında o kitap kartının tatlı bir Fade-out / küçülme animasyonu ile listeden kaybolması.

**Teknik Detaylar:**
- Raf içindeki kitaplar dizisinden (Array) silinen kitabın frontend (React State) üzerinde `.filter()` yardımıyla çıkarılması.
- Modal'in dışarıya tıklandığında (Backdrop click) kapanması kontrolü.

---

## 7. Kitap Listeleme ve Dinamik Ana Sayfa Tasarımı

**API Endpoint:** `GET /api/books`
**Görev:** Uygulama veya raflar genelindeki kitapları listelemek (Görüntüleme sayfası) için tasarım.

**UI Bileşenleri:**
- Ahşap raf konseptine uyumlu ya da modern bir grid layout içerisinde Kitap Kartları (Book Cards).
- Her kartta: Kitap Kapağı, Başlık, Yazar, ve varsa Puanı (Rating yıldızları).
- Veri gelene kadar gösterilecek Skeleton Yükleme Ekranı (Skeleton Screen).
- "Empty State" boş durumu.

**Form Validasyonu ve Kontrol:**
- Eğer liste boş gelirse "Sistemde kitap bulunamadı" gösterimi.

**Kullanıcı Deneyimi:**
- **Lazy Loading (Tembel Yükleme):** Birden fazla kitap kapağı görselinin ağ trafiğini yormaması için sayfa kaydırıldıkça yüklenip görünür olması (Intersection Observer).
- Hover efektleriyle kitap kartının üzerine gelindiğinde zengin bir fiziksel etkileşim hissi verilmesi.

**Teknik Detaylar:**
- Resimlerin orijinal boyutları yerine CSS ile sabit veya `aspect-ratio` oranlarıyla kart içerisindeki taşmalarının (Overflow) engellenmesi.
- URL kırılması (broken image) gibi durumlarda projenin logolu varsayılan kapak görseline (Fallback/Placeholder Image) geri dönmesi.
- Component: `BookList` ve içindeki `BookCard`'ların `.map()` fonksiyonu ile render edilmesi.
