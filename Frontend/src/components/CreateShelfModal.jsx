import { useState } from 'react';
import shelfService from '../services/shelf.service';

const CreateShelfModal = ({ isOpen, onClose, onSuccess }) => {
  const [shelfName, setShelfName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!shelfName.trim()) return;

    setLoading(true);
    try {
      const response = await shelfService.createShelf(shelfName);
      alert(`"${shelfName}" isimli raf başarıyla oluşturuldu!`);
      setShelfName('');
      onClose();
      if (onSuccess) {
        onSuccess(response.shelf || response); 
      }
    } catch (error) {
      console.error('Raf oluşturulurken hata:', error);
      alert('Raf oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
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
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-sage/20 w-full max-w-md overflow-hidden transform transition-all p-6">
        
        <div className="mb-4">
          <h3 className="text-2xl font-extrabold text-navy">Yeni Raf Oluştur</h3>
          <p className="text-sm text-wood/70 mt-1">
            Kütüphaneniz için yeni bir klasör/raf ekleyin.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="shelfName" className="block text-sm font-medium text-wood mb-1">
              Raf Adı
            </label>
            <input
              type="text"
              id="shelfName"
              required
              value={shelfName}
              onChange={(e) => setShelfName(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-sage/30 rounded-xl shadow-sm placeholder-wood/40 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
              placeholder="Örn: Favorilerim, Romanlar..."
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
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShelfModal;
