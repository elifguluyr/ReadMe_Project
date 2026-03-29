# Verda Er'in REST API Metotları

**API Test Videosu:** (https://www.youtube.com/watch?v=ujTSYITQuuY)

## 1. Paylaşım Yapma
- **Endpoint:** `POST /api/paylasim`
- **Authentication:** Bearer Token gerekli.
- **Request Body:** 
  ```json
  {

  "postText": "Bu benim ilk API paylaşımım!"

  }
  ```
- **Response:** `201 Created` - Paylaşım başarıyla oluşturuldu

## 2. Yorum Yapma
- **Endpoint:** `POST /api/paylasim/{paylasimId}/yorum`
- **Authentication:** Bearer Token gerekli.
- **Path Parameters:** 
  - `paylasimId` (string, gerekli) - Yorum yapılacak paylaşımın ID'si.
- **Request Body:** 
  ```json
  {
  "commentText": "Harika bir içerik, tebrikler!"
  }
  ```
- **Response:** `201 Created` - Yorum başarıyla eklendi.

## 3. Yorum Silme
- **Endpoint:** `DELETE /api/paylasim/{paylasimId}/yorum/{yorumId}`
- **Authentication:** Bearer Token gerekli.
- **Path Parameters:** `paylasimId` (string, gerekli)
  - `yorumId` (string, gerekli) - Silinecek spesifik yorumun ID'si.
- **Response:** `200 OK` - Yorum başarıyla silindi.

## 4. Paylaşım Silme
- **Endpoint:** `DELETE /api/paylasim/{paylasimId}`
- **Authentication:** Bearer Token gerekli.
- **Path Parameters:** 
  - `paylasimId` (string, gerekli) - Silinecek ana paylaşımın ID'si.
- **Response:** `200 OK` - Paylaşım ve bağlı tüm yorumlar silindi.

## 5. Paylaşım Beğenme
- **Endpoint:** `POST /api/paylasim/{paylasimId}/begen`
- **Authentication:** Bearer Token gerekli.
- **Path Parameters:** 
  - `paylasimId` (string, gerekli)
- **Response:** `200 OK` - Beğeni sayısı başarıyla artırıldı.

## 6. Yorum Güncelleme
- **Endpoint:** `PUT /api/paylasim/{paylasimId}/yorum/{yorumId}`
- **Authentication:** Bearer Token gerekli.
**Request Body:** 
  ```json
  {

  "commentText": "Bu yorum içeriği güncellenmiştir."

  }
  ```
- **Path Parameters:** 
  - `paylasimId` ve  `yorumId`(string, gerekli). 
- **Response:** `200 OK` - Yorum başarıyla güncellendi.

## 7. Yorumları Listeleme
- **Endpoint:** `GET /api/paylasim/{paylasimId}/yorum`
- **Authentication:** Herkese Açık (Public).
- **Path Parameters:** 
  - `paylasimId` (string, gerekli).
- **Response:** `200 OK` - Paylaşıma ait tüm yorumlar başarıyla getirildi.

## 8. Paylaşımları Listeleme
- **Endpoint:** `GET /api/paylasim`
- **Authentication:** Herkese Açık (Public)
- **Path Parameters:** - Yok
- **Response:** `200 OK` - Tüm paylaşımlar başarıyla getirildi.

