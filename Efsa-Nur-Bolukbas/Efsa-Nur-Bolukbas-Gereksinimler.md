# Efsa Nur Bölükbaş'ın REST API Metotları

**API Test Videosu:** (https://youtu.be/BX4L9_3OLEw)

## 1. Puan Ekleme

- **Endpoint:** `POST /api/ratings`
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "bookId": "BOOK_ID",
  "rating": 5
}
```

- **Response:** `201 Created` - Puan başarıyla eklendi

---

## 2. Puan Silme

- **Endpoint:** `DELETE /api/ratings/{ratingId}`
- **Path Parameters:**
  - `ratingId` (string, required) - Silinecek puanın ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Puan başarıyla silindi

---

## 3. Puan Güncelleme

- **Endpoint:** `PUT /api/ratings/{ratingId}`
- **Path Parameters:**
  - `ratingId` (string, required) - Güncellenecek puanın ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "rating": 3
}
```

- **Response:** `200 OK` - Puan başarıyla güncellendi

---

## 4. Raf Ekleme

- **Endpoint:** `POST /api/shelves`
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "name": "Favorilerim"
}
```

- **Response:** `201 Created` - Raf başarıyla oluşturuldu

---

## 5. Rafa Kitap Ekleme

- **Endpoint:** `POST /api/shelves/{shelfId}/books`
- **Path Parameters:**
  - `shelfId` (string, required) - Kitabın ekleneceği rafın ID'si
- **Authentication:** Bearer Token gerekli
- **Request Body:**

```json
{
  "googleId": "test123",
  "title": "Test Book",
  "author": "Efsa"
}
```

- **Response:** `200 OK` - Kitap rafa başarıyla eklendi

---

## 6. Raftan Kitap Silme

- **Endpoint:** `DELETE /api/shelves/{shelfId}/books/{bookId}`
- **Path Parameters:**
  - `shelfId` (string, required) - İşlem yapılacak rafın ID'si
  - `bookId` (string, required) - Raftan silinecek kitabın ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kitap raftan başarıyla silindi

---

## 7. Kitap Listeleme

- **Endpoint:** `GET /api/books`
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Kitaplar başarıyla listelendi




