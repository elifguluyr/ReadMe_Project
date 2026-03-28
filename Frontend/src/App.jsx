import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Social from './pages/Social';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cream text-wood">
        <Router>
          <header className="border-b border-sage/15 bg-cream/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
            <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <Link to="/social" className="text-xl font-extrabold tracking-tight text-navy hover:text-sage transition-colors">
                ReadMe
              </Link>
              <nav className="flex flex-wrap gap-3 text-sm text-wood/70">
                <Link to="/social" className="rounded-full px-4 py-2 hover:bg-sage/15 hover:text-navy transition-colors">Akış</Link>
                <Link to="/profile" className="rounded-full px-4 py-2 hover:bg-sage/15 hover:text-navy transition-colors">Profil</Link>
                <Link to="/login" className="rounded-full px-4 py-2 hover:bg-sage/15 hover:text-navy transition-colors">Giriş</Link>
                <Link to="/register" className="rounded-full px-4 py-2 hover:bg-sage/15 hover:text-navy transition-colors">Kayıt</Link>
              </nav>
            </div>
          </header>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/social" element={<Social />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/" element={<Navigate to="/social" replace />} />
            <Route path="*" element={<Navigate to="/social" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
