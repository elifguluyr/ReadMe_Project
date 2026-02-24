# Gereksinim Analizi

## Tüm Gereksinimler 

1. **Üye Olma (Oturum Açma)** (Elif Gül Uyar)
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Sisteme henüz dahil olmamış yeni kullanıcıların hesap oluşturmasını sağlar. Kullanıcıdan alınan e-posta ve şifre gibi temel veriler doğrulanarak veritabanına yeni bir kullanıcı kaydı eklenir.

2. **Giriş Yapma** (Elif Gül Uyar)
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Mevcut hesabı bulunan kullanıcıların kimlik doğrulaması yaparak sisteme erişim sağlamasına olanak tanır. Başarılı giriş sonrası kullanıcıya sistemdeki yetkili işlemleri yapabilmesi için bir oturum anahtarı (token) tanımlanır.

3. **Kullanıcı Profili Görüntüleme** (Elif Gül Uyar)
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Belirli bir kullanıcının profil detaylarını getirmek için kullanılır. Eğer `{userId}` giriş yapan kullanıcıya aitse, sistem tüm kişisel bilgileri (e-posta, hesap ayarları vb.) döndürür; eğer farklı bir kullanıcıya aitse sadece herkese açık veriler (ad, soyad, biyografi, takipçi sayısı ve okuma listeleri) listelenir. Bu uç nokta hem kişisel profil yönetimini hem de sosyal etkileşimi destekler.

4. **Profil Güncelleme** (Elif Gül Uyar)
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının mevcut profil bilgilerini (ad, soyad, biyografi vb.) değiştirmesine imkan tanır. Güvenlik gereği kullanıcılar yalnızca kendi hesapları üzerinde güncelleme yetkisine sahiptir.

5. **Arama Yapma** (Elif Gül Uyar)
   - **API Metodu:** `GET /books/search`
   - **Açıklama:** Kullanıcının girdiği anahtar kelimelere göre sistemdeki kitap ve yazar verileri arasında filtreleme yapar. Kitap adı veya yazar ismiyle eşleşen sonuçlar bir liste halinde kullanıcıya sunulur.

6. **Takip Etme** (Elif Gül Uyar)
   - **API Metodu:** `POST /users/follow`
   - **Açıklama:** Bir kullanıcının başka bir kullanıcıyı takip listesine eklemesini sağlar. Bu işlem veritabanında iki kullanıcı arasında yeni bir sosyal etkileşim ilişkisi tanımlar.

7. **Hesap Silme** (Elif Gül Uyar)
   - **API Metodu:** `DELETE /users/{userId}`
   - **Açıklama:** Kullanıcının sistemdeki varlığını tamamen sonlandırmasına ve tüm verilerinin kalıcı olarak temizlenmesine olanak tanır. Bu işlem geri alınamaz ve güvenlik doğrulaması (giriş yapmış olma) gerektirir.

8. **Puan Ekleme** (Efsa Nur Bölükbaş)
   * **API Metodu:** `POST /ratings`
   * **Açıklama:** Kullanıcıların okudukları kitaplara 1-5 arası yıldız puanı vermesini sağlar. Veritabanında yeni bir puanlama kaydı oluşturur.

9. **Puan Silme** (Efsa Nur Bölükbaş)
   * **API Metodu:** `DELETE /ratings/{ratingId}`
   * **Açıklama:** Kullanıcının daha önce bir kitap için vermiş olduğu puanı sistemden tamamen kaldırmasına olanak tanır.

10. **Puan Güncelleme** (Efsa Nur Bölükbaş)
   * **API Metodu:** `PUT /ratings/{ratingId}`
   * **Açıklama:** Kullanıcının mevcut puanını değiştirmesini sağlar. Örneğin; 3 yıldız verilen bir kitap 5 yıldız olarak güncellenebilir.

11. **Raf Ekleme** (Efsa Nur Bölükbaş)
   * **API Metodu:** `POST /shelves`
   * **Açıklama:** Kullanıcının profilinde "Okuduklarım", "Favorilerim" gibi yeni ve özel kitap rafları/kategorileri oluşturmasını sağlar.

12. **Rafa Kitap Ekleme** (Efsa Nur Bölükbaş)
   * **API Metodu:** `POST /shelves/{shelfId}/books`
   * **Açıklama:** Belirli bir kitabın, kullanıcının seçtiği bir rafa dahil edilmesini sağlar. Kitap ve raf arasında ilişki kurar.

13. **Raftan Kitap Silme** (Efsa Nur Bölükbaş)
   * **API Metodu:** `DELETE /shelves/{shelfId}/books/{bookId}`
   * **Açıklama:** Bir kitabın belirli bir raftan çıkarılmasını sağlar. Bu işlem kitabı sistemden silmez, sadece o raftan ayırır.

14. **Kitap Listeleme** (Efsa Nur Bölükbaş)
   * **API Metodu:** `GET /books`
   * **Açıklama:** Sistemde kayıtlı olan tüm kitapların genel bilgilerini (ad, yazar, tür vb.) listeleyerek kullanıcıya sunar.

15. **Paylaşım Yapma** (Verda Er)
   - **API Metodu:** `POST /posts`
   - **Açıklama:**Kullanıcının sistem üzerinde yeni bir gönderi (metin, görsel vb.) oluşturmasını sağlar. Bu işlem için kullanıcının sisteme giriş yapmış olması gerekir.

16. **Yorum Yapma** (Verda Er)
   - **API Metodu:** `POST /posts/{postId}/comments`
   - **Açıklama:** Belirli bir paylaşıma yeni bir yorum eklenmesini sağlar. Yorum içeriği ve ilgili paylaşımın ID bilgisi ile işlem gerçekleştirilir.

17. **Yorum Silme** (Verda Er)
   - **API Metodu:** `DELETE /posts/{postId}/comments/{commentId}`
   - **Açıklama:** Belirli bir paylaşıma ait olan spesifik bir yorumun silinmesini sağlar. Bu yapı, yorumun hangi ana kaynak (post) altında olduğunu doğrulamak ve hiyerarşik kontrol sağlamak için kullanılır. İşlem sadece yorumun sahibi veya yetkili moderatörler tarafından gerçekleştirilebilir.

18. **Paylaşım Silme** (Verda Er)
   - **API Metodu:** `DELETE /posts/{postId}`
   - **Açıklama:** Kullanıcının paylaştığı bir gönderiyi sistemden kaldırmasını sağlar. Paylaşım silindiğinde, o paylaşıma ait yorumlar ve beğeniler de genellikle sistemden temizlenir.

19. **Paylaşım Beğenme** (Verda Er)
   - **API Metodu:** `POST /posts/{postId}/likes`
   - **Açıklama:**Bir kullanıcının belirli bir paylaşımı beğendiğini sisteme kaydeder. Eğer kullanıcı zaten beğenmişse, bu işlem genellikle beğeniyi geri çekmek (unlike) için de yapılandırılabilir.

20. **Yorum Güncelleme** (Verda Er)
   - **API Metodu:** `PUT /posts/{postId}/comments/{commentId}`
   - **Açıklama:** Kullanıcının daha önce yapmış olduğu bir yorumun içeriğini düzenlemesine olanak tanır. Güvenlik gereği sadece yorumu yapan kişi bu işlemi gerçekleştirebilir.

21. **Yorumları Listeleme** (Verda Er)
   - **API Metodu:** `GET/posts/{postId}/comments`
   - **Açıklama:**Belirli bir paylaşıma yapılmış olan tüm yorumların görüntülenmesini sağlar. Genellikle tarih sırasına göre veya popülerliğe göre listeleme yapılır.



## Gereksinim Dağılımları

1. [Elif Gül Uyar'ın Gereksinimleri](Elif-Gül-Uyar/Elif-Gül-Uyar-Gereksinimler.md)
2. [Grup Üyesi 2'nin Gereksinimleri](Grup-Uyesi-2/Grup-Uyesi-2-Gereksinimler.md)
3. [Grup Üyesi 3'ün Gereksinimleri](Grup-Uyesi-3/Grup-Uyesi-3-Gereksinimler.md)
