1. **Paylaşım Yapma**
   - **API Metodu:** `POST /posts`
   - **Açıklama:** Kullanıcının sistem üzerinde yeni bir gönderi (metin, görsel vb.) oluşturmasını sağlar. Bu işlem için kullanıcının sisteme giriş yapmış olması gerekir.

2. **Yorum Yapma**
   - **API Metodu:** `POST /posts/{postId}/comments`
   - **Açıklama:** Belirli bir paylaşıma yeni bir yorum eklenmesini sağlar. Yorum içeriği ve ilgili paylaşımın ID bilgisi ile işlem gerçekleştirilir.

3. **Yorum Silme**
   - **API Metodu:** `DELETE /posts/{postId}/comments/{commentId}`
   - **Açıklama:** Belirli bir paylaşıma ait olan spesifik bir yorumun silinmesini sağlar. Bu yapı, yorumun hangi ana kaynak (post) altında olduğunu doğrulamak ve hiyerarşik kontrol sağlamak için kullanılır. İşlem sadece yorumun sahibi veya yetkili moderatörler tarafından gerçekleştirilebilir.

4. **Paylaşım Silme**
   - **API Metodu:** `DELETE /posts/{postId}`
   - **Açıklama:** Kullanıcının paylaştığı bir gönderiyi sistemden kaldırmasını sağlar. Paylaşım silindiğinde, o paylaşıma ait yorumlar ve beğeniler de genellikle sistemden temizlenir.

5. **Paylaşım Beğenme**
   - **API Metodu:** `POST /posts/{postId}/likes`
   - **Açıklama:** Bir kullanıcının belirli bir paylaşımı beğendiğini sisteme kaydeder. Eğer kullanıcı zaten beğenmişse, bu işlem genellikle beğeniyi geri çekmek (unlike) için de yapılandırılabilir.

6. **Yorum Güncelleme**
   - **API Metodu:** `PUT /posts/{postId}/comments/{commentId}`
   - **Açıklama:** Kullanıcının daha önce yapmış olduğu bir yorumun içeriğini düzenlemesine olanak tanır. Güvenlik gereği sadece yorumu yapan kişi bu işlemi gerçekleştirebilir.

7. **Yorumları Listeleme**
   - **API Metodu:** `GET/posts/{postId}/comments`
   - **Açıklama:** Belirli bir paylaşıma yapılmış olan tüm yorumların görüntülenmesini sağlar. Genellikle tarih sırasına göre veya popülerliğe göre listeleme yapılır.
