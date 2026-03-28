import React, { useState } from 'react';
import postService from '../../services/postService';
import { useAuth } from '../../context/AuthContext';

function CreatePost({ onPostCreated }) {
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim() || !user) return;
    
    setLoading(true);
    try {
      const newPost = await postService.createPost(postText);
      setPostText('');
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Paylaşım yapılamadı:', error);
      const errDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      alert('Hata detayı: ' + errDetail);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sage/20 mb-8 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-sage/5 to-navy/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
        <p className="text-navy font-medium text-lg relative z-10">Fikirlerini paylaşmak için lütfen <a href="/login" className="text-sage font-bold hover:underline">giriş yap</a>.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sage/10 mb-8 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(139,168,136,0.12)] relative overflow-hidden group">
      {/* İnce dekoratif üst çizgi */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sage via-navy to-sage opacity-50"></div>
      
      <div className="flex gap-4 sm:gap-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-br from-navy to-[#5b719c] shrink-0 flex items-center justify-center shadow-md ring-4 ring-cream transition-transform duration-300 group-hover:scale-105">
          <span className="text-white font-bold text-xl drop-shadow-sm">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <textarea
            className="w-full bg-cream/30 rounded-2xl p-4 sm:p-5 text-wood text-[15px] sm:text-base placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:bg-white border border-transparent focus:border-sage/20 shadow-inner transition-all duration-300 resize-none min-h-[120px]"
            placeholder="Bugün hangi kitaptasın? Alıntılarını ve düşüncelerini bizimle paylaş..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-wood/40 font-medium px-2">
              {postText.length > 0 ? `${postText.length} karakter` : 'Kendini özgürce ifade et ✍️'}
            </div>
            <button
              type="submit"
              disabled={loading || !postText.trim()}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-navy text-white font-semibold rounded-full shadow-[0_4px_14px_0_rgba(74,93,130,0.39)] hover:shadow-[0_6px_20px_rgba(74,93,130,0.23)] hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none disabled:bg-sage/30 disabled:text-wood/50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Paylaşılıyor...
                </>
              ) : (
                'Paylaş'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
