import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/user.service';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading, logout } = useAuth(); // Logged in user context
  const navigate = useNavigate();
  const { userId } = useParams(); // target user id from URL (if any)

  const isOwnProfile = !userId || (user && userId === user.id);
  const targetUserId = userId || (user ? user.id : null);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Follow States (For viewing others)
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Edit Modal States (For own profile)
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    profileImage: ''
  });

  // UI Tabs for future modularity (Arkadaşlar için yer tutucular)
  const [activeTab, setActiveTab] = useState('hakkinda'); // hakkinda, kitaplik, paylasimlar

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch target user's profile
        const responseData = await userService.getUserProfile(targetUserId);
        const finalProfile = responseData.user || responseData.data || responseData;
        setProfileData(finalProfile);

        // Ensure modal edit form is ready if it's our own profile
        if (isOwnProfile) {
          setEditForm(prev => ({
            ...prev,
            name: finalProfile.name || '',
            email: finalProfile.email || '',
            bio: finalProfile.bio || '',
            profileImage: finalProfile.profileImage || ''
          }));
        } else {
          // Eğer bir başkasının profilindeysek, BİZ onu takip ediyor muyuz kontrol et!
          try {
            const myData = await userService.getUserProfile(user.id);
            const myProfile = myData.user || myData.data || myData;
            if (myProfile && myProfile.following && myProfile.following.includes(targetUserId)) {
              setIsFollowing(true);
            } else {
              setIsFollowing(false);
            }
          } catch (myErr) {
            console.warn("Kendi profilin çekilirken hata oluştu. Veritabanından silinmiş olabilirsin (GHOST USER).", myErr);
            setIsFollowing(false);
          }
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError(err.response?.data?.message || err.response?.data?.error || `Sunucuya erişilemedi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, authLoading, targetUserId, isOwnProfile]);

  if (authLoading || (!profileData && loading)) {
    return (
      <div className="min-h-screen bg-cream flex justify-center items-center">
        <div className="text-navy font-bold text-xl animate-pulse">
          {authLoading ? "Oturum Kontrol Ediliyor..." : "Profil Yükleniyor..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-red-500/10 border border-red-100 text-center max-w-lg w-full">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-3xl font-extrabold text-navy mb-2">Profil Çekilemedi</h2>
          <p className="text-wood/80 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-sage text-white rounded-lg hover:bg-navy transition-colors font-semibold">
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const displayUser = profileData || user;

  const getInitials = (name) => {
    if (!name) return "RU";
    const parts = name.trim().split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isUnchanged =
      editForm.name === (displayUser.name || '') &&
      editForm.email === (displayUser.email || '') &&
      editForm.bio === (displayUser.bio || '') &&
      editForm.profileImage === (displayUser.profileImage || '') &&
      !editForm.password;

    if (isUnchanged) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;

      await userService.updateProfile(payload);
      setProfileData(prev => ({ ...prev, ...payload }));
      setIsEditing(false);
      alert('Profil başarıyla güncellendi!');
    } catch (err) {
      console.error(err);
      alert('Güncelleme başarısız oldu: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleFollowStatus = async () => {
    setIsFollowLoading(true);
    try {
      const res = await userService.toggleFollow(targetUserId);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
      alert('İşlem başarısız oldu: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("DİKKAT! Hesabını ve tüm verilerini KALICI olarak silmek istediğine emin misin? Bu işlem geri alınamaz.");
    if (!confirmDelete) return;

    try {
      await userService.deleteAccount();
      alert("Hesabın başarıyla silindi. Hoşçakal!");
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Hesap silme başarısız oldu: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-transparent w-full flex flex-col items-center justify-center relative min-h-screen">

      {/* UPDATE MODAL OVERLAY (Only for Own Profile) */}
      {isOwnProfile && isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* ... Modal ... */}
          <div className="bg-cream rounded-2xl shadow-2xl border border-sage/30 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-navy p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Profili Düzenle</h3>
              <button onClick={() => setIsEditing(false)} className="text-white/70 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Ad Soyad</label>
                <input type="text" value={editForm.name} required onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2 rounded-xl text-left border border-sage/30 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">E-posta</label>
                <input type="email" value={editForm.email} required onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2 rounded-xl text-left border border-sage/30 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Yeni Şifre <span className="text-wood/50 text-xs">(Değiştirmemek için boş bırak)</span></label>
                <input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 rounded-xl text-left border border-sage/30 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Biyografi</label>
                <textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-xl text-left border border-sage/30 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navy resize-none" ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Profil Resmi URL</label>
                <input type="text" value={editForm.profileImage} onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })} placeholder="https://örnek.com/resim.jpg" className="w-full px-4 py-2 rounded-xl text-left border border-sage/30 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-navy" />
              </div>

              {/* HESABI KAPAT BOLUMU - TASK 5 */}
              <div className="mt-4 pt-4 border-t border-sage/20 flex justify-start">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 text-sm font-bold rounded-xl shadow-sm transition-colors"
                >
                  Hesabımı Kalıcı Olarak Sil
                </button>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-sage/20 mt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 text-navy font-semibold hover:bg-sage/10 rounded-xl transition-colors">İptal</button>
                <button type="submit" disabled={isUpdating} className="px-6 py-2 bg-sage hover:bg-navy text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50">{isUpdating ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Profile Layout */}
      <div className="w-full p-4 lg:w-[1024px] mx-auto space-y-6 flex-1 text-center">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-sage/10 overflow-hidden border border-sage/10 relative text-left">

          <div className="h-32 sm:h-48 bg-gradient-to-r from-navy via-sage to-navy bg-[length:200%_auto] animate-gradient-slow w-full relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="px-6 pb-2 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-4 items-center">

              <div className="inline-block relative">
                {displayUser.profileImage && displayUser.profileImage.startsWith('http') ? (
                  <img src={displayUser.profileImage} alt={displayUser.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white relative z-10" onError={(e) => { e.target.onerror = null; e.target.src = '' }} />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-navy to-sage text-white flex items-center justify-center text-4xl font-extrabold relative z-10">
                    {getInitials(displayUser.name)}
                  </div>
                )}
              </div>

              <div className="mt-4 sm:mt-0 flex flex-wrap gap-3 z-10 w-full sm:w-auto relative justify-center sm:justify-start">
                {isOwnProfile ? (
                  <>
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-navy text-white text-sm font-bold rounded-xl shadow-md hover:bg-navy/90 hover:shadow-lg transition-transform transform hover:-translate-y-0.5 w-full sm:w-auto flex-1 sm:flex-none">
                      Profili Düzenle
                    </button>
                    <button onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                      className="px-6 py-2.5 bg-wood/10 text-wood hover:bg-navy hover:text-white border border-wood/20 text-sm font-bold rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 w-full sm:w-auto flex-1 sm:flex-none"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleFollowStatus}
                    disabled={isFollowLoading}
                    className={`px-6 py-2.5 text-sm font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 w-full sm:w-auto disabled:opacity-50 ${isFollowing ? 'bg-cream text-navy border-2 border-sage hover:bg-sage/10' : 'bg-sage text-white hover:bg-navy'}`}
                  >
                    {isFollowLoading ? 'Bekleniyor...' : (isFollowing ? 'Takipten Çık' : 'Takip Et')}
                  </button>
                )}
              </div>
            </div>

            <div className="text-center sm:text-left mt-2 px-2 pb-2">
              <h1 className="text-3xl font-extrabold truncate" style={{ color: '#4A5D82' }}>{displayUser.name || 'Ad Soyad'}</h1>
              <p className="text-wood/70 text-base sm:text-lg flex items-center justify-center sm:justify-start gap-2 mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {displayUser.email}
              </p>

              {/* RESTORED VISIBLE STATS */}
              <div className="mt-4 flex justify-center sm:justify-start gap-6 font-medium text-navy/80 pb-2">
                <div className="flex flex-col items-center sm:items-start group cursor-pointer">
                  <span className="font-extrabold text-2xl text-navy group-hover:text-sage transition-colors">{displayUser.following?.length || 0}</span>
                  <span className="text-xs uppercase tracking-wide">Takip Edilen</span>
                </div>
                {/* Optional Placeholder for 'Takipçi' (Followers) when backend supports it */}
                <div className="flex flex-col items-center sm:items-start opacity-50 cursor-not-allowed" title="Henüz API de desteklenmiyor">
                  <span className="font-extrabold text-2xl text-navy">0</span>
                  <span className="text-xs uppercase tracking-wide">Takipçi</span>
                </div>
              </div>
            </div>
          </div>

          {/* TAKIM ARKADAŞI ENTEGRASYON ALANI (Genişletilebilir Tablar) */}
          <div className="bg-cream/40 px-6 pt-4 border-t border-sage/20 rounded-b-3xl">
            <div className="flex justify-center sm:justify-start gap-6 border-b border-sage/30 pb-[-1px]">
              <button onClick={() => setActiveTab('hakkinda')} className={`pb-3 font-semibold text-sm sm:text-base border-b-2 transition-colors ${activeTab === 'hakkinda' ? 'border-navy text-navy' : 'border-transparent text-wood/60 hover:text-navy'}`}>Hakkında</button>
              <button onClick={() => navigate('/books')} className="pb-3 font-semibold text-sm sm:text-base border-b-2 transition-colors border-transparent text-wood/60 hover:text-navy">Kitaplık</button>
              <button onClick={() => setActiveTab('paylasimlar')} className={`pb-3 font-semibold text-sm sm:text-base border-b-2 transition-colors ${activeTab === 'paylasimlar' ? 'border-navy text-navy' : 'border-transparent text-wood/60 hover:text-navy'}`}>Gönderiler</button>
            </div>

            <div className="py-8 text-center sm:text-left min-h-[250px]">
              {activeTab === 'hakkinda' && (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 bg-white p-6 rounded-2xl border border-sage/10 text-wood leading-relaxed shadow-sm">
                    <h4 className="text-lg font-bold text-navy mb-3">Biyografi</h4>
                    {displayUser.bio || "Henüz bir biyografi eklenmemiş."}
                  </div>
                </div>
              )}



              {activeTab === 'paylasimlar' && (
                <div className="flex flex-col gap-4 text-left min-h-[160px]">
                  {displayUser.posts?.length > 0 ? (
                    displayUser.posts.map((post) => (
                      <div key={post._id} className="bg-white p-5 rounded-2xl border border-sage/10 shadow-sm transition-all hover:shadow-md">
                        <p className="text-navy text-base leading-relaxed mb-3">{post.content}</p>
                        <span className="text-xs text-wood/60 border-t border-sage/10 pt-2 block">
                          Paylaşım: {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4 opacity-90 bg-white/50 rounded-2xl border border-sage/20 border-dashed">
                      <svg className="w-14 h-14 text-sage mb-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p className="text-navy/90 font-medium text-lg">Henüz hiç paylaşım yapmadınız.</p>
                      <p className="text-wood/80 text-sm mt-1 mb-5 text-center max-w-sm">
                        Okuduğunuz kitaplar hakkında ilk düşüncenizi paylaşmak için harika bir zaman!
                      </p>
                      <button
                        onClick={() => navigate('/social')}
                        className="px-6 py-2.5 bg-sage text-white rounded-full text-sm font-semibold shadow-sm hover:bg-sage/90 hover:shadow-md transition-all duration-300"
                      >
                        İlk Gönderini Paylaş
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
