import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      alert('Giriş Başarılı!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.status || err.response?.data?.error || 'Bilinmeyen bir hata oluştu.';
      setError(`Giriş başarısız: ${serverMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-navy">
          ReadMe
        </h2>
        <p className="mt-2 text-center text-sm text-wood/70">
          Akıllı kütüphane ve sosyal ağ platformu
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-navy focus:ring-navy border-sage/30 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-wood/80 cursor-pointer">
                  Beni Hatırla
                </label>
              </div>

              <div className="text-sm">
                <button type="button" className="font-medium text-navy hover:text-sage transition-colors duration-200">
                  Şifremi Unuttum
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-navy hover:bg-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-wood/60">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="font-medium text-navy hover:text-sage transition-colors duration-200">
              Hemen Kaydol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
