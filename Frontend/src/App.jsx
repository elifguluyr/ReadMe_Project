import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Social from './pages/Social';
import PostDetail from './pages/PostDetail';
import Books from './pages/Books';
import Home from './pages/Home';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="border-b border-sage/15 bg-cream/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/home" className="text-xl font-extrabold tracking-tight text-navy hover:text-sage transition-colors">
          ReadMe
        </Link>
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cream text-wood">
        <Router>
          <NavigationBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/social" element={<Social />} />
            <Route path="/home" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
