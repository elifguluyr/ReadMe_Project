import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/user.service';
import bookService from '../services/book.service';
import shelfService from '../services/shelf.service';
import BookCard from '../components/BookCard';
import CreateShelfModal from '../components/CreateShelfModal';
import AddBookModal from '../components/AddBookModal';

const Books = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [shelves, setShelves] = useState([]);
  const [booksDict, setBooksDict] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedShelfForAdd, setSelectedShelfForAdd] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Profil bilgisini ve Rafları Getir
      const profileResponse = await userService.getUserProfile(user.id);
      const userData = profileResponse.user || profileResponse.data || profileResponse;
      
      const userShelves = userData.shelf || [];
      setShelves(userShelves);

      // 2. Tüm kitapları ID bazlı eşleştirmek için DB'den çek
      const allBooksResponse = await bookService.getBooks();
      const allBooksArray = Array.isArray(allBooksResponse) ? allBooksResponse : allBooksResponse.books || [];
      
      const dict = {};
      allBooksArray.forEach(b => {
        if (b._id) dict[b._id] = b;
      });
      setBooksDict(dict);

    } catch (err) {
      console.error('Veriler yüklenirken hata oluştu:', err);
      setError('Raflarınız yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async (shelfId, bookId) => {
    try {
      await shelfService.removeBookFromShelf(shelfId, bookId);
      // Refresh the page data after successful deletion
      fetchData();
    } catch (err) {
      console.error('Kitap silinirken hata oluştu:', err);
      alert('Kitap silinirken bir hata oluştu.');
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate, authLoading]);

  // Auth durumu bekleniyorsa ekran yanıp sönmemesi için boş dönebiliriz.
  if (authLoading) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Çıkış Yap Butonu */}
        <div className="absolute top-0 right-0 z-20">
          <button 
            onClick={handleLogout}
            className="px-5 py-2.5 bg-white/50 backdrop-blur-md text-wood/90 font-bold tracking-wide rounded-full border border-wood/20 hover:bg-wood hover:text-cream transition-all duration-300 shadow-sm flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış Yap
          </button>
        </div>

        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-4">
            Kitaplarım ve Raflarım
          </h1>
          <p className="max-w-xl mx-auto text-lg text-wood/70 mb-6">
            Eklediğiniz kitapları ve sınıflandırdığınız rafları buradan inceleyebilirsiniz.
          </p>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-sage text-white font-bold rounded-xl shadow-lg border border-transparent hover:bg-navy hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Raf Ekle
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-center shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {shelves.length > 0 ? (
              shelves.map((shelf) => (
                <div key={shelf._id} className="relative bg-white/60 backdrop-blur-3xl px-6 sm:px-12 pt-10 pb-16 rounded-[2.5rem] border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] mb-20 overflow-hidden">
                  
                  {/* Decorative subtle background shapes for Glassmorphism (Added warm Wood tones) */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-wood/10 blur-3xl mix-blend-multiply pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-navy/5 blur-3xl mix-blend-multiply pointer-events-none"></div>

                  {/* Header Title & Button */}
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-6">
                    <div className="flex items-end gap-5 border-b-2 border-wood/30 pb-3 w-full sm:w-auto">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">{shelf.name}</h2>
                      <span className="text-sm font-bold text-wood mb-1.5 uppercase tracking-widest bg-wood/10 border border-wood/10 px-4 py-1.5 rounded-full shadow-sm">
                        {shelf.books?.length || 0} Kitap
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedShelfForAdd(shelf)}
                      className="px-6 py-2.5 bg-navy text-cream font-bold rounded-full shadow-lg shadow-navy/20 hover:shadow-xl hover:-translate-y-1 hover:bg-sage transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">+</span>
                      Yeni Kitap Ekle
                    </button>
                  </div>
                  
                  {shelf.books && shelf.books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-24 gap-x-0 w-full relative z-10">
                      {shelf.books.map((bookId) => {
                        const bookData = booksDict[bookId];
                        return bookData ? (
                          <div key={bookId} className="relative px-6 pb-2 pt-4 flex flex-col justify-end group z-10 hover:z-50">
                            
                            {/* Elegant Minimalist Floating Wood/Glass Shelf */}
                            <div className="absolute bottom-0 left-2 right-2 h-[8px] bg-gradient-to-r from-wood/30 via-wood/70 to-wood/30 backdrop-blur-xl shadow-[0_20px_30px_rgba(139,90,43,0.15)] border-t border-wood/40 rounded-full z-0 transform translate-y-1"></div>
                            
                            {/* Sharp glass highlight reflection on the wood */}
                            <div className="absolute bottom-1.5 left-5 right-5 h-px bg-white/80 z-0 opacity-50"></div>

                            {/* The Book Card Container with dramatic lift on hover */}
                            <div className="relative z-10 w-full max-w-[260px] mx-auto h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-6 group-hover:scale-[1.03]">
                              <BookCard 
                                book={bookData} 
                                onRemove={() => handleRemoveBook(shelf._id, bookId)} 
                              />
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-wood/60 italic text-sm p-4 bg-white/40 rounded-xl border border-dashed border-sage/30">
                      Bu rafta henüz kitap bulunmuyor.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-wood/60 py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-sage/10 shadow-sm">
                Henüz hiçbir raf oluşturmamışsınız. Yeni raf ekle butonuna tıklayıp kütüphanenizi oluşturabilirsiniz!
              </div>
            )}
          </div>
        )}
      </div>

      <CreateShelfModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => fetchData()} 
      />

      <AddBookModal
        isOpen={!!selectedShelfForAdd}
        onClose={() => setSelectedShelfForAdd(null)}
        shelf={selectedShelfForAdd}
        onSuccess={() => fetchData()}
      />
    </div>
  );
};

export default Books;
