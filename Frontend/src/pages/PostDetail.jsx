import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import PostCard from '../components1/social/PostCard';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = await postService.getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Gönderi getirilemedi:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handlePostDeleted = () => {
    // Başarıyla silindiği zaman bir önceki ekrana / akış sayfasına dön.
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Üst Navigasyon Çubuğu */}
      <div className="bg-cream border-b border-sage/30 py-3 px-4 sticky top-0 z-50 shadow-sm flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-sage/10 transition-colors group"
          title="Geri Dön"
        >
          <svg className="w-5 h-5 text-wood/60 group-hover:text-navy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <span className="font-semibold text-navy text-base">Gönderi</span>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 py-8 antialiased">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-navy"></div>
          </div>
        ) : post ? (
          <PostCard 
            post={post} 
            onDeletePost={handlePostDeleted} 
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-sage/20">
            <h3 className="text-lg font-medium text-navy mb-1">Gönderi Bulunamadı</h3>
            <p className="text-wood/70">Aradığınız paylaşım ulaşılamıyor. URL'yi kontrol edin veya silinmiş olabilir.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
