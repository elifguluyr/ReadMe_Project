import { useState } from 'react';
import RatingSystem from './RatingSystem';
import ShelfModal from './ShelfModal';

const BookCard = ({ book, onRemove }) => {
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemoveClick = async () => {
    if (onRemove) {
      setRemoving(true);
      try {
        await onRemove();
      } finally {
        setRemoving(false);
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-xl shadow-sage/20 rounded-2xl border border-sage/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-navy/20 flex flex-col h-full relative overflow-hidden">
      
      {/* Kırmızı Çarpı İkonu - Alternatif Silme Butonu */}
      {onRemove && (
        <button 
          type="button"
          onClick={handleRemoveClick}
          disabled={removing}
          className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-sm p-1 rounded-full text-wood/60 hover:text-red-600 hover:bg-white transition-all disabled:opacity-50"
          title="Raftan Sil"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}

      {/* Book Cover Area */}
      <div className="w-full h-56 shrink-0 relative flex items-center justify-center bg-sage/10 border-b border-sage/20 overflow-hidden">
        {book.imageLinks?.thumbnail ? (
          <img 
            src={book.imageLinks.thumbnail.replace('http:', 'https:')} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full p-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-navy via-navy/90 to-sage/40`}>
            {/* Virtual Cover Text */}
            <span className="text-cream/90 font-serif text-2xl font-bold tracking-wider drop-shadow-md line-clamp-3">
              {book.title || 'İsimsiz Kitap'}
            </span>
            <span className="text-sage/80 text-sm mt-3 border-t border-sage/30 pt-2 w-3/4 line-clamp-1">
              {book.author || 'Bilinmeyen Yazar'}
            </span>
          </div>
        )}
      </div>

      {/* Book Info Section */}
      <div className="flex-grow mt-2 px-6 pt-4">
        <h3 className="text-xl font-bold text-navy mb-1 line-clamp-2">
          {book.title || 'İsimsiz Kitap'}
        </h3>
        <p className="text-sm text-wood/80 font-medium mb-3">
          {book.author || 'Bilinmeyen Yazar'}
        </p>
        
        {/* Additional Book Detail example */}
        <p className="text-xs text-wood/60 line-clamp-3 mb-4">
          {book.description || 'Bu kitap için henüz bir açıklama girilmemiş.'}
        </p>
      </div>

      {/* Action Buttons Section */}
      <div className="mt-auto space-y-3 pt-4 border-t border-sage/10">
        
        {/* Placeholder for Rating System */}
        <div className="flex items-center justify-between text-sm text-wood/70">
          <span className="font-medium">Puan Ver</span>
          <RatingSystem bookId={book._id || book.id || book.googleId} initialRatingObj={book.userRating} />
        </div>

        {/* Action Button: Remove or Add depending on context */}
        {!onRemove && (
          <button
            type="button"
            onClick={() => setIsShelfModalOpen(true)}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-sage hover:bg-navy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage transition-all duration-300"
          >
            Rafa Ekle
          </button>
        )}
      </div>

      {/* Render the Shelf Modal */}
      {!onRemove && (
        <ShelfModal 
          isOpen={isShelfModalOpen} 
          onClose={() => setIsShelfModalOpen(false)} 
          book={book} 
        />
      )}
    </div>
  );
};

export default BookCard;
