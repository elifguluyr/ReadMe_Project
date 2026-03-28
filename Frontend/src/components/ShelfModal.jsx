import { useState } from 'react';
import shelfService from '../services/shelf.service';

const ShelfModal = ({ isOpen, onClose, book }) => {
  const [shelfName, setShelfName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !book) return null;

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!shelfName.trim()) return;

    setLoading(true);
    try {
      // 1. Create a new shelf
      const shelfResponse = await shelfService.createShelf(shelfName);
      
      // Get the newly created shelf's ID from backend response (assuming typical structure _id or id)
      // If the backend returns it inside `shelf` object like { message: "...", shelf: { _id: "..." } }
      const newShelfId = shelfResponse.shelf?._id || shelfResponse._id || shelfResponse.id;

      if (!newShelfId) {
        alert("Raf oluşturuldu ancak ID'si alınamadığı için kitap eklenemedi.");
        onClose();
        return;
      }

      // 2. Add the book to the newly created shelf
      const bookData = {
        googleId: book.googleId || book._id || 'unknown_id',
        title: book.title || 'İsimsiz Kitap',
        author: book.author || 'Bilinmeyen Yazar',
        imageLinks: book.imageLinks || null
      };

      await shelfService.addBookToShelf(newShelfId, bookData);
      
      alert(`"${shelfName}" rafı oluşturuldu ve kitap başarıyla eklendi!`);
      setShelfName('');
      onClose();
    } catch (error) {
      console.error('Raf işlemi sırasında hata:', error);
      alert('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Glassmorphism effect on the background) */}
      <div 
        className="absolute inset-0 bg-wood/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-sage/20 w-full max-w-md overflow-hidden transform transition-all p-6">
        
        <div className="mb-4">
          <h3 className="text-2xl font-extrabold text-navy">Raf İşlemleri</h3>
          <p className="text-sm text-wood/70 mt-1">
            <strong className="text-wood">{book.title}</strong> kitabını yeni bir rafa ekleyin.
          </p>
        </div>

        <form onSubmit={handleCreateAndAdd} className="space-y-4">
          <div>
            <label htmlFor="shelfName" className="block text-sm font-medium text-wood mb-1">
              Yeni Raf Adı
            </label>
            <input
              type="text"
              id="shelfName"
              required
              value={shelfName}
              onChange={(e) => setShelfName(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
              placeholder="Örn: Favorilerim, Okuyacaklarım..."
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 bg-cream text-wood font-medium rounded-xl border border-wood/20 hover:bg-wood/5 focus:outline-none focus:ring-2 focus:ring-wood/20 transition-all duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-navy text-white font-bold rounded-xl shadow-lg border border-transparent hover:bg-sage focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : 'Raf Oluştur ve Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShelfModal;
