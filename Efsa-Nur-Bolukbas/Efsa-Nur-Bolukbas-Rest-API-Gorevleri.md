# Efsa Nur Bölükbaş - REST API Görevleri

 
**Video:** `BURAYA_YOUTUBE_VIDEO_LINKI`

---

## 1. Puan Ekleme

- **Endpoint:** `POST /api/ratings`
- **Authorization:** `Bearer Token` gereklidir
- **Açıklama:** Kullanıcıların okudukları kitaplara 1-5 arası yıldız puanı vermesini sağlar. Veritabanında yeni bir puanlama kaydı oluşturur.

### Request Body
```json
{
  "bookId": "BOOK_ID",
  "rating": 5
}
```

### Response
- `201 Created` - Puan başarıyla eklendi

---

## 2. Puan Silme

- **Endpoint:** `DELETE /api/ratings/{ratingId}`
- **Authorization:** `Bearer Token` gereklidir
- **Açıklama:** Kullanıcının daha önce bir kitap için vermiş olduğu puanı sistemden tamamen kaldırmasına olanak tanır.

### Path Parameters
- `ratingId` (string, required) - Silinecek puanın ID değeri

### Response
- `200 OK` - Puan başarıyla silindi

---

## 3. Puan Güncelleme

- **Endpoint:** `PUT /api/ratings/{ratingId}`
- **Authorization:** `Bearer Token` gereklidir
- **Açıklama:** Kullanıcının mevcut puanını değiştirmesini sağlar. Örneğin; 3 yıldız verilen bir kitap 5 yıldız olarak güncellenebilir.

### Path Parameters
- `ratingId` (string, required) - Güncellenecek puanın ID değeri

### Request Body
```json
{
  "rating": 3
}
```

### Response
- `200 OK` - Puan başarıyla güncellendi

---

## 4. Raf Ekleme

- **Endpoint:** `POST /api/shelves`
- **Authorization:** `Bearer Token` gereklidir
- **Açıklama:** Kullanıcının profilinde "Okuduklarım", "Favorilerim" gibi yeni ve özel kitap rafları/kategorileri oluşturmasını sağlar.

### Request Body
```json
{
  "name": "Favorilerim"
}
```

### Response
- `201 Created` - Raf başarıyla oluşturuldu

---

## 5. Rafa Kitap Ekleme

- **Endpoint:** `POST /api/shelves/{shelfId}/books`
- **Authorization:** `Bearer Token` gereklidir
- **Açıklama:** Belirli bir kitabın, kullanıcının seçtiği bir rafa dahil edilmesini sağlar. Kitap ve raf arasında ilişki kurar.

### Path Parameters
- `shelfId` (string, required) - Kitabın ekleneceği rafın ID değeri

### Request Body
```json
{
  "googleId": "test123",
  "title": "Test Book",
  "author": "Efsa"
}
```

### Response
- `200 OK` - Kitap rafa başarıyla eklendi

---

## 6. Raftan Kitap Silme

- **Endpoint:** `DELETE /api/shelves/{shelfId}/books/{bookId}`
- **Authorization:** `Bearer Token` gereklidir
- **Açıklama:** Bir kitabın belirli bir raftan çıkarılmasını sağlar. Bu işlem kitabı sistemden silmez, sadece o raftan ayırır.

### Path Parameters
- `shelfId` (string, required) - İşlem yapılacak rafın ID değeri
- `bookId` (string, required) - Raftan çıkarılacak kitabın ID değeri

### Response
- `200 OK` - Kitap raftan başarıyla silindi

---

## 7. Kitap Listeleme

- **Endpoint:** `GET /api/books`
- **Authorization:** Gerekli değildir
- **Açıklama:** Sistemde kayıtlı olan tüm kitapların genel bilgilerini listeleyerek kullanıcıya sunar.

### Request Body
Bu endpoint için request body gönderilmez.

### Response
- `200 OK` - Kitaplar başarıyla listelendi

---

## JWT Kullanımı

JWT Token gerektiren endpointlerde istek gönderilirken `Authorization` alanında `Bearer Token` kullanılmalıdır.

### Örnek Header
```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Test Süreci

Bu endpointlerin tamamı Postman kullanılarak test edilmiştir.  
Testler sırasında önce kullanıcı kaydı ve giriş işlemleri gerçekleştirilmiş, ardından JWT token alınarak yetkilendirme gerektiren endpointlerde Bearer Token ile doğrulama sağlanmıştır.

Test edilen işlemler şunlardır:

1. Kullanıcı kaydı oluşturma  
2. Kullanıcı girişi yapma  
3. Kitapları listeleme  
4. Raf oluşturma  
5. Rafa kitap ekleme  
6. Puan ekleme  
7. Puan güncelleme  
8. Puan silme  
9. Raftan kitap silme  

Tüm testler başarıyla tamamlanmıştır.