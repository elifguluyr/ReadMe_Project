# Elif Gül Uyar'ın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Üye Olma
- **Endpoint:** `POST /auth/signup`
- **Request Body:** 
  ```json
  {
    "name": "Elif",
    "email": "kullanici@example.com",
    "password": "Guvenli123!",
    "bio": "yeni kitap kurdu",
    "profileImage": "ornekresim.com"
  }
  ```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu

## 2. Giriş Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:** 
  ```json
  {
    "email": "kullanici@example.com",
    "password": "Guvenli123!",
  }
  ```
- **Response:** `200 OK` - Giriş yapıldı

## 3. Kullanıcı Bilgilerini Görüntüleme
- **Endpoint:** `GET /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Gerekli değil.
- **Response:** `200 OK` - Kullanıcı bilgileri başarıyla getirildi

## 4. Kullanıcı Bilgilerini Güncelleme
- **Endpoint:** `PUT /users/`
- **Request Body:** 
  ```json
  {
    "name":"Elif",
    "email": "yeniemail@example.com",
    "password": "+905551234567"
    "bio": "Eski kitap kurdu",
    "profileImage": "ornekresim.com"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı başarıyla güncellendi

## 5. Kullanıcı Silme
- **Endpoint:** `DELETE /users`
- **Authentication:** Bearer Token gerekli (Yönetici yetkisi veya kendi hesabını silme yetkisi)
- **Response:** `204 No Content` - Kullanıcı başarıyla silindi

## 6. Takip Etme/Takipten Çıkma
- **Endpoint:** `POST /users/{userId}`
- **Path Parameters:** 
  - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Takip edildi!

## 7. Kitap Arama
- **Endpoint:** `GET /api/books/search`
- **Query Parameters:** 
  - q (string, required) - Aranacak kitap ismi (Örn: ?q=simyacı)
- **Authentication:** Gerekli değil.
- **Response:** `200 OK` - Bulunan kitapların listesini (ID, isim, yazar, kapak, puan) JSON dizisi olarak döndürür. Bulunamazsa boş döner veya 404 hatası verir.