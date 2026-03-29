import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import CreatePost from '../components1/social/CreatePost';
import PostCard from '../components1/social/PostCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Social() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postService.getPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Paylaşımlar çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((currentPosts) => [newPost, ...currentPosts]);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((currentPosts) => currentPosts.filter(post => post._id !== deletedPostId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((currentPosts) => currentPosts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] relative overflow-hidden pb-20 selection:bg-sage/30 selection:text-navy">
      {/* Dekoratif Arka Plan Lekeleri (Blob) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sage/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-navy/5 blur-[120px] pointer-events-none"></div>
      
      {/* Ana Header Alanı - Cam (Glassmorphism) Efektli */}
     <div className="sticky top-0 z-[100] bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-md">
           <h2 
              style={{ color: '#000000', opacity: 1, visibility: 'visible' }} 
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            >
               Gönderi Akışı
            </h2>
        <div className="flex items-center gap-3">
            {!user ? (
               <button 
                 onClick={() => navigate('/login')} 
                 className="text-sm bg-navy text-white px-5 py-2 rounded-full shadow-md font-semibold hover:bg-[#5b719c] hover:shadow-lg transition-all active:scale-95"
               >
                 Giriş Yap
               </button>
            ) : (
               <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/profile')}>
                 <span className="text-navy/70 group-hover:text-navy text-sm font-semibold transition-colors hidden sm:block">
                   Profilim
                 </span>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cream to-sage/30 flex items-center justify-center text-navy font-bold shadow-inner ring-2 ring-white group-hover:ring-sage/40 transition-all">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                 </div>
               </div>
            )}
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-0 py-8 relative z-10 antialiased">
        <CreatePost onPostCreated={handlePostCreated} />

        {loading && posts.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-24 gap-4 animate-in fade-in duration-700">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-sage/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-navy border-t-transparent animate-spin"></div>
            </div>
            <p className="text-navy/60 font-medium text-sm animate-pulse">Gönderileryükleniyor...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            {loading && (
              <div className="mb-4 rounded-3xl border border-sage/20 bg-white/80 px-5 py-4 text-sm text-navy/70 shadow-sm backdrop-blur-sm">
                <span className="font-medium">Yeni içerik yükleniyor...</span>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {posts.map((post) => (
                 <PostCard 
                   key={post._id} 
                   post={post} 
                   onDeletePost={handlePostDeleted} 
                   onUpdatePost={handlePostUpdated}
                 />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-sage/20 mt-8">
            <div className="w-20 h-20 mx-auto bg-sage/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">Akış Şimdilik Sessiz</h3>
            <p className="text-wood/60 max-w-sm mx-auto">Henüz kitap evreninden hiçbir paylaşım yok. İlk adımı sen at ve sessizliği boz!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Social;
