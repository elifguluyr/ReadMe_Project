import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import postService from '../../services/postService';

const CommentItem = ({ comment, postId, onDeleteComment, onUpdateComment, currentUser }) => {
  const commentAuthor = typeof comment.user === 'object' ? comment.user : (
    (comment.user === currentUser?.id || comment.user === currentUser?._id) ? currentUser : null
  );
  const isOwner = commentAuthor && currentUser && (commentAuthor._id || commentAuthor.id) === currentUser.id;
  const authorName = commentAuthor?.name || 'Kullanıcı';
  const authorInitial = commentAuthor?.name ? commentAuthor.name.charAt(0).toUpperCase() : 'C';
  const commentDate = new Date(comment.date || comment.createdAt);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.commentText);

  const handleSave = () => {
    if (editText.trim() && editText !== comment.commentText) {
      onUpdateComment(postId, comment._id, editText);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex gap-4 mb-4 text-sm text-wood group transition-all">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-navy flex items-center justify-center shrink-0 shadow-sm mt-1">
        <span className="font-semibold text-white text-xs">{authorInitial}</span>
      </div>
      <div className="flex-1 bg-cream/30 hover:bg-cream/60 transition-colors p-3.5 rounded-2xl border border-white relative group-hover:shadow-[0_4px_12px_rgb(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-1">
          <p className="font-semibold text-navy">
            {authorName} 
            <span className="text-wood/50 font-medium text-[11px] ml-2 tracking-wide">
              {!isNaN(commentDate) ? commentDate.toLocaleDateString() : ''}
            </span>
          </p>
          {isOwner && !isEditing && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1 text-wood/40 hover:text-navy hover:bg-white rounded-md transition-colors"
                title="Düzenle"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button 
                onClick={() => onDeleteComment(postId, comment._id)}
                className="p-1 text-wood/40 hover:text-red-500 hover:bg-white rounded-md transition-colors"
                title="Yorumu Sil"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2 text-left animate-in fade-in slide-in-from-top-1">
            <textarea
              className="w-full bg-white border border-sage/30 rounded-xl p-3 text-wood text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none min-h-[80px]"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => { setIsEditing(false); setEditText(comment.commentText); }} className="px-4 py-1.5 text-xs font-semibold text-wood/70 hover:text-navy bg-transparent hover:bg-sage/10 rounded-full transition-colors">İptal</button>
              <button onClick={handleSave} className="px-4 py-1.5 text-xs font-semibold text-white bg-navy hover:bg-[#5b719c] rounded-full shadow-sm hover:shadow-md transition-all">Kaydet</button>
            </div>
          </div>
        ) : (
          <p className="text-wood/90 leading-relaxed whitespace-pre-wrap">{comment.commentText}</p>
        )}
      </div>
    </div>
  );
};

function PostCard({ post, onDeletePost, onUpdatePost }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [localLikedBy, setLocalLikedBy] = useState(Array.isArray(post.likedBy) ? post.likedBy : []);
  const [localLikes, setLocalLikes] = useState(typeof post.likes === 'number' ? post.likes : (Array.isArray(post.likedBy) ? post.likedBy.length : 0));

  const currentUserId = user?.id || user?._id;
  const author = typeof post.user === 'object' ? post.user : (
    (post.user === currentUserId || post.user === user?._id) ? user : null
  );
  const authorName = author?.name || 'Bilinmeyen Kullanıcı';
  const authorInitial = author?.name ? author.name.charAt(0).toUpperCase() : 'U';
  const postDate = new Date(post.date || post.createdAt);

  const isLiked = currentUserId ? localLikedBy.some((likeUser) => (likeUser?._id || likeUser)?.toString() === currentUserId?.toString()) : false;
  const likes = localLikes;

  const isPostOwner = currentUserId && author && currentUserId === (author._id || author.id);

  const handleLike = async () => {
    if (!user) return alert('Beğenmek için giriş yapmalısınız!');
    if (likeLoading) return;

    setLikeLoading(true);

   
    const previousLikedBy = [...localLikedBy];
    const previousLikes = localLikes;

    if (isLiked) {
      setLocalLikedBy(localLikedBy.filter((likeUser) => (likeUser?._id || likeUser)?.toString() !== currentUserId?.toString()));
      setLocalLikes(Math.max(0, localLikes - 1));
    } else {
      setLocalLikedBy([...localLikedBy, user]);
      setLocalLikes(localLikes + 1);
    }

    try {
      const updated = await postService.toggleLike(post._id);
      const updatedLikedBy = Array.isArray(updated.likedBy) ? updated.likedBy : [];
      const updatedLikes = typeof updated.likes === 'number' ? updated.likes : updatedLikedBy.length;
      const updatedPost = {
        ...post,
        ...updated,
        user: post.user || updated.user,
        postText: post.postText || updated.postText,
        comments: post.comments || updated.comments,
        date: post.date || updated.date,
        likes: updatedLikes,
        likedBy: updatedLikedBy,
      };

      setLocalLikedBy(updatedLikedBy);
      setLocalLikes(updatedLikes);
      if (onUpdatePost) {
        onUpdatePost(updatedPost);
      }
    } catch (error) {
      console.error('Like error:', error);
    
      setLocalLikedBy(previousLikedBy);
      setLocalLikes(previousLikes);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDeletePostClick = async () => {
    if (!window.confirm('Bu paylaşımı gerçekten silmek istiyor musun?')) return;
    try {
      await postService.deletePost(post._id);
      if (onDeletePost) {
        onDeletePost(post._id);
      }
    } catch (error) {
      console.error('Post silinemedi:', error);
      alert('Paylaşım silinirken bir hata oluştu.');
    }
  };

  useEffect(() => {
    setLocalLikedBy(Array.isArray(post.likedBy) ? post.likedBy : []);
    setLocalLikes(typeof post.likes === 'number' ? post.likes : (Array.isArray(post.likedBy) ? post.likedBy.length : 0));
  }, [post.likedBy, post.likes]);

  const handleFetchComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
         const data = await postService.getComments(post._id);
         setComments(data);
      } catch (error) {
         console.error('Yorumlar çekilemedi:', error);
      } finally {
         setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
       const createdComment = await postService.addComment(post._id, newComment);
       setComments(prev => [...prev, createdComment]);
       setNewComment('');

       const data = await postService.getComments(post._id);
       if (Array.isArray(data)) setComments(data);
    } catch (error) {
       console.error('Yorum yapılamadı:', error);
       alert("Yorum Eklenemedi: " + (error.response?.data?.mesaj || error.message));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!commentId) return alert('Bu yorum henüz veritabanına kaydediliyor, lütfen sayfayı yenileyin.');
    if (!window.confirm('Yorumu silmek istediğine emin misin?')) return;
    try {
      await postService.deleteComment(postId, commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Yorum silme hatası:', error);
      alert('Yorum silinemedi: ' + (error.response?.data?.mesaj || error.message));
    }
  };

  const handleUpdateComment = async (postId, commentId, newText) => {
    try {
      await postService.updateComment(postId, commentId, newText);
      setComments(comments.map(c => c._id === commentId ? { ...c, commentText: newText } : c));
    } catch (error) {
      console.error('Yorum güncelleme hatası:', error);
      alert('Yorum güncellenemedi: ' + (error.response?.data?.mesaj || error.message));
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-sage/10 p-5 sm:p-7 mb-7 transition-all duration-500 ease-out hover:-translate-y-1 group/card">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sage to-cream border border-sage/20 shadow-sm flex items-center justify-center text-navy font-bold text-lg">
            {authorInitial}
          </div>
          <div>
            <h3 className="font-bold text-navy text-base leading-tight">
               {authorName}
            </h3>
            <p className="text-xs text-wood/50 mt-1 font-medium inline-block tracking-wide">
              {!isNaN(postDate) ? `${postDate.toLocaleDateString()} • ${postDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Tarih Yok'}
            </p>
          </div>
        </div>
        
        {isPostOwner && (
          <button 
            onClick={handleDeletePostClick}
            className="text-wood/30 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-all duration-200 opacity-0 group-hover/card:opacity-100 focus:opacity-100"
            title="Paylaşımı Sil"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="block text-wood text-[16px] leading-relaxed mb-6 whitespace-pre-wrap sm:ml-16 transition-colors">
        {post.postText}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:ml-16">
        <button 
          onClick={handleLike} 
          disabled={likeLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${isLiked ? 'text-[#ff4b4b] bg-red-50' : 'text-wood/60 hover:text-[#ff4b4b] hover:bg-red-50 hover:scale-105 active:scale-95'}`}
          title={isLiked ? 'Beğeniyi kaldır' : 'Beğen'}
        >
          <svg className={`w-5 h-5 transition-transform ${isLiked ? 'scale-110' : ''}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Beğen</span>
          {likes > 0 && <span>{likes}</span>}
        </button>
        
        <button 
          onClick={handleFetchComments} 
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-wood/60 hover:text-navy hover:bg-sage/10 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {comments.length > 0 && !showComments && <span>{comments.length} Yorum</span>}
          {comments.length === 0 && !showComments && <span>Yorum Yap</span>}
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-6 p-4 sm:p-6 bg-cream/20 rounded-3xl border border-sage/10 sm:ml-16 animate-in fade-in slide-in-from-top-4 duration-500">
           {loadingComments ? (
             <div className="flex justify-center items-center py-8">
               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy"></div>
             </div>
           ) : (
             <div className="mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
               {comments.length > 0 ? comments.map((c, i) => (
                 <CommentItem key={c._id || i} comment={c} postId={post._id} onDeleteComment={handleDeleteComment} onUpdateComment={handleUpdateComment} currentUser={user} />
                )) : <div className="text-center py-4"><p className="text-sm font-medium text-wood/50 mb-1">Henüz yorum yok.</p><p className="text-xs text-wood/40">İlk düşünen sen ol!</p></div>}
             </div>
           )}

           {user && (
             <form onSubmit={submitComment} className="flex gap-3 items-center relative z-10">
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy to-[#5b719c] shrink-0 shadow-sm flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user.name ? user.name.charAt(0).toUpperCase() : 'B'}</span>
               </div>
               <div className="relative flex-1 group">
                 <input
                   type="text"
                   value={newComment}
                   onChange={e => setNewComment(e.target.value)}
                   placeholder="Hikayeye yorum kat..."
                   className="w-full bg-white border border-sage/20 rounded-full pl-5 pr-14 py-3 text-sm text-navy placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-transparent transition-all shadow-sm group-hover:shadow"
                 />
                 <button 
                    type="submit" 
                    disabled={!newComment.trim()} 
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-navy text-white rounded-full w-9 flex items-center justify-center hover:bg-[#5b719c] hover:scale-105 active:scale-95 transition-all disabled:bg-sage/20 disabled:text-wood/40 disabled:scale-100 disabled:cursor-not-allowed shadow-sm"
                 >
                    <svg className="w-4 h-4 ml-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                 </button>
               </div>
             </form>
           )}
        </div>
      )}
    </div>
  );
}

export default PostCard;
