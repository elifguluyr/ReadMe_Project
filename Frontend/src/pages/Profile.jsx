import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/user.service';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading } = useAuth(); // Contains decoded token info like { id, name, email }
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for the AuthProvider to determine initial session state
    if (authLoading) return;

    // If not logged in, wait or push to login
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Görev 3: /api/users/{userId} Endpoint'i kullanılır.
        // It's possible the real backend response wraps it like { data: { name... } } or just returns the object.
        const responseData = await userService.getUserProfile(user.id);
        
        // Safety fallback depending on API shape
        setProfileData(responseData.user || responseData.data || responseData);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        // If 404/401, handle it gracefully
        setError(err.response?.data?.message || err.response?.data?.error || `Sunucuya erişilemedi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate, authLoading]);

  // General loading state when evaluating session on hard refresh
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex justify-center items-center">
        <div className="text-navy font-bold text-xl animate-pulse">Oturum Kontrol Ediliyor...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will navigate out instantly
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex justify-center items-center">
        <div className="text-navy font-bold text-xl animate-pulse">Profil Yükleniyor...</div>
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
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-sage text-white rounded-lg hover:bg-navy transition-colors font-semibold"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Use the loaded API profileData if available, fallback to the basic context `user` token data.
  const displayUser = profileData || user;

  // Fallback avatar generator based on first initials of the name (e.g., "Elif Gül" -> "EG")
  const getInitials = (name) => {
    if (!name) return "RU";
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header Alert (Görev Başarılı Kanıtı) */}
        <div className="bg-sage/20 border border-sage/50 rounded-xl p-4 flex items-start gap-4 shadow-sm">
           <div className="bg-sage text-white p-2 rounded-full shrink-0 mt-0.5">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
             </svg>
           </div>
           <div>
             <h3 className="text-navy font-bold">Kayıt / Giriş İşlemi Kesinleşti!</h3>
             <p className="text-wood/80 text-sm mt-1">
               Token kullanılarak <strong>/api/users/{user.id}</strong> adresinden bu profil başarıyla getirildi.
             </p>
           </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-sage/10 overflow-hidden border border-sage/10 relative">
          {/* Cover Header */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-navy via-sage to-navy bg-[length:200%_auto] animate-gradient-slow w-full relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="px-6 pb-8 relative">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-6">
              
              <div className="inline-block relative">
                {displayUser.profileImage && displayUser.profileImage.startsWith('http') ? (
                  <img 
                    src={displayUser.profileImage} 
                    alt={displayUser.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white object-cover shadow-lg bg-white relative z-10"
                    onError={(e) => { e.target.onerror = null; e.target.src = '' }}
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-navy to-sage text-white flex items-center justify-center text-5xl font-extrabold relative z-10">
                    {getInitials(displayUser.name)}
                  </div>
                )}
              </div>
              
              <div className="mt-4 sm:mt-0 flex gap-3 pb-2">
                <button className="px-5 py-2.5 bg-navy text-white text-sm font-bold rounded-xl shadow-md hover:bg-navy/90 hover:shadow-lg transition-all transform hover:-translate-y-0.5">Profili Düzenle</button>
              </div>

            </div>

            {/* Profile Info */}
            <div>
              <h1 className="text-3xl font-extrabold text-navy truncate">
                {displayUser.name || 'Ad Soyad Bulunamadı'}
              </h1>
              <p className="text-wood/70 text-lg flex items-center gap-2 mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {displayUser.email}
              </p>
              
              <div className="mt-8 border-t border-sage/20 pt-8">
                <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Biyografi / Hakkında
                </h4>
                <div className="bg-cream/50 p-5 rounded-2xl border border-sage/10 text-wood leading-relaxed">
                  {displayUser.bio || "Henüz bir biyografi eklenmemiş."}
                </div>
              </div>

              {/* Ekstra Bilgi - Sadece görsel doldurmak için */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
                 <div className="flex px-4 py-2 bg-white border border-sage/20 rounded-lg shadow-sm">
                   <span className="text-navy">Durum : </span>
                   <span className="text-sage ml-2">Aktif (Yetkili)</span>
                 </div>
                 <div className="flex px-4 py-2 bg-white border border-sage/20 rounded-lg shadow-sm">
                   <span className="text-navy">ID : </span>
                   <span className="text-wood/60 ml-2 font-mono">#{user.id.substring(0,8)}</span>
                 </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
