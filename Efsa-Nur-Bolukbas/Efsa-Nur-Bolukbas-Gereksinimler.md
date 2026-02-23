 Efsa Nur Bölükbaş - Proje Gereksinimleri

**1. Puan Ekleme**
* **API Metodu:** `POST /ratings`
* **Açıklama:** Kullanıcıların okudukları kitaplara 1-5 arası yıldız puanı vermesini sağlar. Veritabanında yeni bir puanlama kaydı oluşturur.

**2. Puan Silme**
* **API Metodu:** `DELETE /ratings/{ratingId}`
* **Açıklama:** Kullanıcının daha önce bir kitap için vermiş olduğu puanı sistemden tamamen kaldırmasına olanak tanır.

**3. Puan Güncelleme**
* **API Metodu:** `PUT /ratings/{ratingId}`
* **Açıklama:** Kullanıcının mevcut puanını değiştirmesini sağlar. Örneğin; 3 yıldız verilen bir kitap 5 yıldız olarak güncellenebilir.

**4. Raf Ekleme**
* **API Metodu:** `POST /shelves`
* **Açıklama:** Kullanıcının profilinde "Okuduklarım", "Favorilerim" gibi yeni ve özel kitap rafları/kategorileri oluşturmasını sağlar.

**5. Rafa Kitap Ekleme**
* **API Metodu:** `POST /shelves/{shelfId}/books`
* **Açıklama:** Belirli bir kitabın, kullanıcının seçtiği bir rafa dahil edilmesini sağlar. Kitap ve raf arasında ilişki kurar.

**6. Raftan Kitap Silme**
* **API Metodu:** `DELETE /shelves/{shelfId}/books/{bookId}`
* **Açıklama:** Bir kitabın belirli bir raftan çıkarılmasını sağlar. Bu işlem kitabı sistemden silmez, sadece o raftan ayırır.

**7. Kitap Listeleme**
* **API Metodu:** `GET /books`
* **Açıklama:** Sistemde kayıtlı olan tüm kitapların genel bilgilerini (ad, yazar, tür vb.) listeleyerek kullanıcıya sunar.