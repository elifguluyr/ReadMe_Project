# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [ReadME.yaml](ReadMe.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: ReadMe API
  description: |
    ReadMe akıllı kütüphane ve sosyal ağ platformu için RESTful API.

    ## Kapsam (Gereksinimler)
    - Üyelik: Register / Login (JWT)
    - Kullanıcı: Profil görüntüleme, profil güncelleme, hesap silme, takip etme
    - Kitap: Listeleme, arama
    - Raf: Raf ekleme, rafa kitap ekleme, raftan kitap çıkarma
    - Puan: Ekleme, güncelleme, silme
    - Sosyal: Paylaşım yapma, paylaşım silme, yorum ekle/güncelle/sil/listele, beğenme
  version: 1.0.0
  contact:
    name: ReadMe API Support
    email: api-support@readme.local
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3000/api/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri
  - name: users
    description: Kullanıcı işlemleri (profil, takip, silme)
  - name: books
    description: Kitap işlemleri (listeleme, arama)
  - name: shelves
    description: Raf işlemleri
  - name: ratings
    description: Puanlama işlemleri
  - name: posts
    description: Paylaşım işlemleri
  - name: comments
    description: Yorum işlemleri
  - name: likes
    description: Beğeni işlemleri

security:
  - bearerAuth: []

paths:
  /auth/register:
    post:
      tags: [auth]
      summary: Üye ol (register)
      description: Sisteme yeni kullanıcı kaydı oluşturur.
      operationId: registerUser
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
            examples:
              example1:
                summary: Örnek kayıt
                value:
                  email: "user@mail.com"
                  password: "Guvenli123!"
                  fullName: "Efsa Nur"
      responses:
        '201':
          description: Kullanıcı oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'

  /auth/login:
    post:
      tags: [auth]
      summary: Giriş yap (login)
      description: Email ve şifre ile giriş yapar, JWT token döner.
      operationId: loginUser
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
            examples:
              example1:
                summary: Örnek giriş
                value:
                  email: "user@mail.com"
                  password: "Guvenli123!"
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}:
    get:
      tags: [users]
      summary: Kullanıcı profili görüntüleme
      description: |
        Belirli bir kullanıcının profilini getirir.
        - userId giriş yapan kullanıcıysa daha fazla bilgi (private) dönebilir.
        - değilse public alanlar dönebilir.
      operationId: getUserProfile
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: Profil döndürüldü
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      tags: [users]
      summary: Profil güncelleme
      description: Kullanıcı kendi profilini günceller.
      operationId: updateUserProfile
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateProfileRequest'
            examples:
              example1:
                summary: Örnek güncelleme
                value:
                  fullName: "Verda Er"
                  bio: "Kitap delisiyim "
      responses:
        '200':
          description: Profil güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [users]
      summary: Hesap silme
      description: Kullanıcı kendi hesabını kalıcı olarak siler.
      operationId: deleteUserAccount
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '204':
          description: Kullanıcı silindi (No Content)
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /users/follow:
    post:
      tags: [users]
      summary: Takip etme
      description: Bir kullanıcının başka bir kullanıcıyı takip etmesini sağlar.
      operationId: followUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FollowRequest'
            examples:
              example1:
                summary: Örnek takip
                value:
                  followerId: "u_123"
                  followingId: "u_999"
      responses:
        '201':
          description: Takip ilişkisi oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FollowResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          $ref: '#/components/responses/Conflict'

  /books:
    get:
      tags: [books]
      summary: Kitap listeleme
      description: Sistemdeki kitapları listeler.
      operationId: listBooks
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: Kitap listesi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookList'
        '400':
          $ref: '#/components/responses/BadRequest'

  /books/search:
    get:
      tags: [books]
      summary: Arama yapma
      description: Kitap adı veya yazar adına göre arama yapar.
      operationId: searchBooks
      parameters:
        - name: q
          in: query
          required: true
          description: Arama anahtar kelimesi (kitap / yazar)
          schema:
            type: string
          example: "Orhan Pamuk"
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: Arama sonuçları
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookList'
        '400':
          $ref: '#/components/responses/BadRequest'

  /shelves:
    post:
      tags: [shelves]
      summary: Raf ekleme
      description: Kullanıcı yeni raf oluşturur.
      operationId: createShelf
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateShelfRequest'
            examples:
              example1:
                summary: Örnek raf
                value:
                  name: "Favorilerim"
      responses:
        '201':
          description: Raf oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Shelf'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /shelves/{shelfId}/books:
    post:
      tags: [shelves]
      summary: Rafa kitap ekleme
      description: Bir kitabı belirtilen rafa ekler.
      operationId: addBookToShelf
      parameters:
        - $ref: '#/components/parameters/ShelfIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddBookToShelfRequest'
            examples:
              example1:
                summary: Örnek ekleme
                value:
                  bookId: "b_101"
      responses:
        '201':
          description: Kitap rafa eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ShelfBookLink'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          $ref: '#/components/responses/Conflict'

  /shelves/{shelfId}/books/{bookId}:
    delete:
      tags: [shelves]
      summary: Raftan kitap silme
      description: Kitabı raftan kaldırır (kitabı sistemden silmez).
      operationId: removeBookFromShelf
      parameters:
        - $ref: '#/components/parameters/ShelfIdParam'
        - $ref: '#/components/parameters/BookIdParam'
      responses:
        '204':
          description: Raftan kaldırıldı
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

  /ratings:
    post:
      tags: [ratings]
      summary: Puan ekleme
      description: Kullanıcı bir kitaba 1-5 arası puan verir.
      operationId: createRating
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRatingRequest'
            examples:
              example1:
                summary: Örnek puan
                value:
                  bookId: "b_101"
                  stars: 5
      responses:
        '201':
          description: Puan eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Rating'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          $ref: '#/components/responses/Conflict'

  /ratings/{ratingId}:
    put:
      tags: [ratings]
      summary: Puan güncelleme
      description: Kullanıcı puanını günceller.
      operationId: updateRating
      parameters:
        - $ref: '#/components/parameters/RatingIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateRatingRequest'
            examples:
              example1:
                summary: Örnek güncelleme
                value:
                  stars: 3
      responses:
        '200':
          description: Puan güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Rating'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [ratings]
      summary: Puan silme
      description: Kullanıcının daha önce verdiği puanı siler.
      operationId: deleteRating
      parameters:
        - $ref: '#/components/parameters/RatingIdParam'
      responses:
        '204':
          description: Puan silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

  /posts:
    post:
      tags: [posts]
      summary: Paylaşım yapma
      description: Kullanıcı yeni gönderi oluşturur (metin/görsel).
      operationId: createPost
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePostRequest'
            examples:
              example1:
                summary: Örnek post
                value:
                  content: "Bu ay 5 kitap bitirdim!"
                  imageUrl: "https://example.com/img.png"
      responses:
        '201':
          description: Paylaşım oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /posts/{postId}:
    delete:
      tags: [posts]
      summary: Paylaşım silme
      description: Kullanıcı kendi gönderisini siler.
      operationId: deletePost
      parameters:
        - $ref: '#/components/parameters/PostIdParam'
      responses:
        '204':
          description: Paylaşım silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /posts/{postId}/comments:
    post:
      tags: [comments]
      summary: Yorum yapma
      description: Paylaşıma yorum ekler.
      operationId: createComment
      parameters:
        - $ref: '#/components/parameters/PostIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCommentRequest'
            examples:
              example1:
                summary: Örnek yorum
                value:
                  content: "Çok iyi öneri, listeme aldım!"
      responses:
        '201':
          description: Yorum eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

    get:
      tags: [comments]
      summary: Yorumları listeleme
      description: Paylaşıma ait yorumları listeler.
      operationId: listComments
      parameters:
        - $ref: '#/components/parameters/PostIdParam'
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: Yorum listesi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CommentList'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

  /posts/{postId}/comments/{commentId}:
    put:
      tags: [comments]
      summary: Yorum güncelleme
      description: Kullanıcı kendi yorumunu günceller.
      operationId: updateComment
      parameters:
        - $ref: '#/components/parameters/PostIdParam'
        - $ref: '#/components/parameters/CommentIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateCommentRequest'
            examples:
              example1:
                summary: Örnek güncelleme
                value:
                  content: "Düzeltme: ikinci kitap daha güzeldi 😄"
      responses:
        '200':
          description: Yorum güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [comments]
      summary: Yorum silme
      description: Kullanıcı kendi yorumunu silebilir.
      operationId: deleteComment
      parameters:
        - $ref: '#/components/parameters/PostIdParam'
        - $ref: '#/components/parameters/CommentIdParam'
      responses:
        '204':
          description: Yorum silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /posts/{postId}/likes:
    post:
      tags: [likes]
      summary: Paylaşım beğenme
      description: Kullanıcı paylaşımı beğenir (like).
      operationId: likePost
      parameters:
        - $ref: '#/components/parameters/PostIdParam'
      responses:
        '201':
          description: Beğeni eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Like'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          $ref: '#/components/responses/Conflict'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile kimlik doğrulama

  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      description: Kullanıcı ID
      schema:
        type: string
      example: "u_123"

    ShelfIdParam:
      name: shelfId
      in: path
      required: true
      description: Raf ID
      schema:
        type: string
      example: "s_10"

    BookIdParam:
      name: bookId
      in: path
      required: true
      description: Kitap ID
      schema:
        type: string
      example: "b_101"

    RatingIdParam:
      name: ratingId
      in: path
      required: true
      description: Puan ID
      schema:
        type: string
      example: "r_55"

    PostIdParam:
      name: postId
      in: path
      required: true
      description: Paylaşım ID
      schema:
        type: string
      example: "p_77"

    CommentIdParam:
      name: commentId
      in: path
      required: true
      description: Yorum ID
      schema:
        type: string
      example: "c_88"

    PageParam:
      name: page
      in: query
      description: Sayfa numarası
      schema:
        type: integer
        minimum: 1
        default: 1

    LimitParam:
      name: limit
      in: query
      description: Sayfa başına kayıt sayısı
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

  schemas:
    RegisterRequest:
      type: object
      required: [email, password, fullName]
      properties:
        email:
          type: string
          format: email
          example: "user@mail.com"
        password:
          type: string
          format: password
          minLength: 6
          example: "Guvenli123!"
        fullName:
          type: string
          example: "Efsa Nur"

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
          example: "user@mail.com"
        password:
          type: string
          format: password
          example: "Guvenli123!"

    AuthResponse:
      type: object
      required: [token, user]
      properties:
        token:
          type: string
          description: JWT access token
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        user:
          $ref: '#/components/schemas/UserProfile'

    UserProfile:
      type: object
      required: [id, fullName]
      properties:
        id:
          type: string
          example: "u_123"
        fullName:
          type: string
          example: "Elif Gül Uyar"
        bio:
          type: string
          nullable: true
          example: "Kitap delisiyim "
        followersCount:
          type: integer
          example: 120
        followingCount:
          type: integer
          example: 45

    UpdateProfileRequest:
      type: object
      properties:
        fullName:
          type: string
          example: "Efsa Nur Bölükbaş"
        bio:
          type: string
          example: "Yeni biyografi"

    FollowRequest:
      type: object
      required: [followerId, followingId]
      properties:
        followerId:
          type: string
          example: "u_123"
        followingId:
          type: string
          example: "u_999"

    FollowResponse:
      type: object
      required: [followerId, followingId, createdAt]
      properties:
        followerId:
          type: string
        followingId:
          type: string
        createdAt:
          type: string
          format: date-time
          example: "2026-03-04T10:15:00Z"

    Book:
      type: object
      required: [id, title, author]
      properties:
        id:
          type: string
          example: "b_101"
        title:
          type: string
          example: "Kürk Mantolu Madonna"
        author:
          type: string
          example: "Sabahattin Ali"
        genre:
          type: string
          nullable: true
          example: "Roman"

    BookList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Book'
        pagination:
          $ref: '#/components/schemas/Pagination'

    CreateShelfRequest:
      type: object
      required: [name]
      properties:
        name:
          type: string
          example: "Favorilerim"

    Shelf:
      type: object
      required: [id, name, ownerUserId]
      properties:
        id:
          type: string
          example: "s_10"
        name:
          type: string
          example: "Okuduklarım"
        ownerUserId:
          type: string
          example: "u_123"

    AddBookToShelfRequest:
      type: object
      required: [bookId]
      properties:
        bookId:
          type: string
          example: "b_101"

    ShelfBookLink:
      type: object
      required: [shelfId, bookId, addedAt]
      properties:
        shelfId:
          type: string
          example: "s_10"
        bookId:
          type: string
          example: "b_101"
        addedAt:
          type: string
          format: date-time
          example: "2026-03-04T10:15:00Z"

    CreateRatingRequest:
      type: object
      required: [bookId, stars]
      properties:
        bookId:
          type: string
          example: "b_101"
        stars:
          type: integer
          minimum: 1
          maximum: 5
          example: 5

    UpdateRatingRequest:
      type: object
      required: [stars]
      properties:
        stars:
          type: integer
          minimum: 1
          maximum: 5
          example: 3

    Rating:
      type: object
      required: [id, bookId, userId, stars, createdAt]
      properties:
        id:
          type: string
          example: "r_55"
        bookId:
          type: string
          example: "b_101"
        userId:
          type: string
          example: "u_123"
        stars:
          type: integer
          example: 5
        createdAt:
          type: string
          format: date-time
          example: "2026-03-04T10:15:00Z"

    CreatePostRequest:
      type: object
      required: [content]
      properties:
        content:
          type: string
          example: "Bu ay 5 kitap bitirdim!"
        imageUrl:
          type: string
          nullable: true
          example: "https://example.com/img.png"

    Post:
      type: object
      required: [id, userId, content, createdAt]
      properties:
        id:
          type: string
          example: "p_77"
        userId:
          type: string
          example: "u_123"
        content:
          type: string
          example: "Bu ay 5 kitap bitirdim!"
        imageUrl:
          type: string
          nullable: true
          example: "https://example.com/img.png"
        createdAt:
          type: string
          format: date-time
          example: "2026-03-04T10:15:00Z"

    CreateCommentRequest:
      type: object
      required: [content]
      properties:
        content:
          type: string
          example: "Çok iyi öneri!"

    UpdateCommentRequest:
      type: object
      required: [content]
      properties:
        content:
          type: string
          example: "Düzeltme: harika öneri!"

    Comment:
      type: object
      required: [id, postId, userId, content, createdAt]
      properties:
        id:
          type: string
          example: "c_88"
        postId:
          type: string
          example: "p_77"
        userId:
          type: string
          example: "u_999"
        content:
          type: string
          example: "Çok iyi öneri, listeme aldım!"
        createdAt:
          type: string
          format: date-time
          example: "2026-03-04T10:15:00Z"

    CommentList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Comment'
        pagination:
          $ref: '#/components/schemas/Pagination'

    Like:
      type: object
      required: [id, postId, userId, createdAt]
      properties:
        id:
          type: string
          example: "l_12"
        postId:
          type: string
          example: "p_77"
        userId:
          type: string
          example: "u_123"
        createdAt:
          type: string
          format: date-time
          example: "2026-03-04T10:15:00Z"

    Pagination:
      type: object
      properties:
        page:
          type: integer
          description: Mevcut sayfa
          example: 1
        limit:
          type: integer
          description: Sayfa başına kayıt
          example: 20
        totalPages:
          type: integer
          description: Toplam sayfa sayısı
          example: 5
        totalItems:
          type: integer
          description: Toplam kayıt sayısı
          example: 95

    Error:
      type: object
      type: object
      properties:
        code:
          type: string
          description: Hata kodu
          example: "VALIDATION_ERROR"
        message:
          type: string
          type: string
        details:
          type: array
          description: Detaylı hata bilgileri
          items:
            type: object
            properties:
              field:
                type: string
                example: "email"
              message:
                type: string
                example: "Email formatı geçersiz"

  responses:
    BadRequest:
      description: Geçersiz istek
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "BAD_REQUEST"
            message: "İstek parametreleri geçersiz"
            message: "İstek parametreleri geçersiz"
    Unauthorized:
      description: Yetkisiz erişim
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "UNAUTHORIZED"
            message: "Kimlik doğrulama başarısız"
            message: "Kimlik doğrulama başarısız"

    Forbidden:
      description: Erişim reddedildi
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "FORBIDDEN"
            message: "Bu işlem için yetkiniz bulunmamaktadır"
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "NOT_FOUND"
            message: "İstenen kaynak bulunamadı"
            message: "İstenen kaynak bulunamadı"

    Conflict:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
          example:
            code: "CONFLICT"
