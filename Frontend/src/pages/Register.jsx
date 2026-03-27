import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(name, email, password, bio, profileImage);
      alert('Kayıt Başarılı!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.status || err.response?.data?.error || err.response?.data?.message || 'Bilinmeyen bir hata oluştu.';
      setError(`Kayıt başarısız: ${serverMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-navy">
          Kayıt Ol
        </h2>
        <p className="mt-2 text-center text-sm text-wood/70">
          Okuma serüvenine sen de katıl
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-sage/20 rounded-2xl sm:px-10 border border-sage/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm bg-opacity-80">
                {error}
              </div>
            )}

            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-wood"
              >
                Ad Soyad
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                  placeholder="Elif Gül Uyar"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-wood"
              >
                E-posta Adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-wood"
              >
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="bio" 
                className="block text-sm font-medium text-wood"
              >
                Biyografi (İsteğe bağlı)
              </label>
              <div className="mt-1">
                <input
                  id="bio"
                  name="bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                  placeholder="yeni kitap kurdu"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="profileImage" 
                className="block text-sm font-medium text-wood"
              >
                Profil Resmi URL (İsteğe bağlı)
              </label>
              <div className="mt-1">
                <input
                  id="profileImage"
                  name="profileImage"
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                  placeholder="https://ornekresim.com/foto.jpg"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-navy hover:bg-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-wood/60">
            Zaten bir hesabınız var mı?{' '}
            <a href="/login" className="font-medium text-navy hover:text-sage transition-colors duration-200">
              Giriş Yap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
