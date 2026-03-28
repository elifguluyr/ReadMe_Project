import { useState } from 'react';
import bookService from '../services/book.service';
import shelfService from '../services/shelf.service';

const AddBookModal = ({ isOpen, onClose, shelf, onSuccess }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [addingBookId, setAddingBookId] = useState(null);
  const [searchError, setSearchError] = useState('');

  if (!isOpen || !shelf) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoadingSearch(true);
    setSearchError('');
    setResults([]);

    try {
      const data = await bookService.searchBooks(query);
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setSearchError('Arama sırasında bir hata oluştu veya sonuç bulunamadı.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleAddBook = async (book) => {
    setAddingBookId(book.googleId);
    try {
      const bookData = {
        googleId: book.googleId,
        title: book.title,
        author: book.authors ? book.authors.join(', ') : 'Bilinmeyen Yazar'
      };

      await shelfService.addBookToShelf(shelf._id, bookData);
      alert(`"${book.title}" rafa başarıyla eklendi!`);
      
      // Temizle ve modalı kapat
      setQuery('');
      setResults([]);
      onClose();
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert('Kitap eklenirken hata oluştu.');
    } finally {
      setAddingBookId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-wood/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sage/20 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all p-6">
        
        <div className="mb-4">
          <h3 className="text-2xl font-extrabold text-navy">
            {shelf.name} <span className="text-wood/60 font-medium text-lg">Rafına Kitap Ekle</span>
          </h3>
          <button onClick={onClose} className="absolute top-6 right-6 text-wood/40 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
            placeholder="Kitap veya yazar adı ara..."
          />
          <button
            type="submit"
            disabled={loadingSearch}
            className="px-6 py-3 bg-navy text-white font-bold rounded-xl shadow-md hover:bg-sage focus:outline-none focus:ring-2 focus:ring-sage transition-all duration-300 disabled:opacity-50"
          >
            {loadingSearch ? 'Aranıyor...' : 'Ara'}
          </button>
        </form>

        {searchError && (
          <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
            {searchError}
          </div>
        )}

        <div className="overflow-y-auto flex-grow space-y-3 pr-2 scrollbar-thin scrollbar-thumb-sage/40">
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.googleId} className="flex items-center justify-between p-4 bg-cream/50 border border-sage/20 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 flex-grow overflow-hidden">
                  <img 
                    src={item.imageLinks?.thumbnail || 'https://via.placeholder.com/60x90?text=Kapak+Yok'} 
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded shadow-sm"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-navy truncate">{item.title}</h4>
                    <p className="text-sm text-wood/70 truncate">{item.authors?.join(', ') || 'Bilinmeyen Yazar'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddBook(item)}
                  disabled={addingBookId === item.googleId}
                  className="ml-4 shrink-0 px-4 py-2 bg-sage text-white text-sm font-bold rounded-lg hover:bg-navy transition-colors disabled:opacity-50"
                >
                  {addingBookId === item.googleId ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            ))
          ) : (
            !loadingSearch && query && !searchError && (
               <div className="text-center text-wood/50 py-8">Sonuç bulunamadı.</div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default AddBookModal;
