import { useState, useEffect } from 'react';
import ratingService from '../services/rating.service';

const RatingSystem = ({ bookId, initialRatingObj = null }) => {
  // initialRatingObj expected to be something like { _id: 'rating123', rating: 4 }
  const [rating, setRating] = useState(initialRatingObj?.rating || 0);
  const [ratingId, setRatingId] = useState(initialRatingObj?._id || null);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRating(initialRatingObj?.rating || 0);
    setRatingId(initialRatingObj?._id || null);
  }, [initialRatingObj]);

  const handleRating = async (newRating) => {
    if (loading) return;
    setLoading(true);

    try {
      // If clicking the same rating, treat it as DELETE (un-rating)
      if (newRating === rating && ratingId) {
        await ratingService.deleteRating(ratingId);
        setRating(0);
        setRatingId(null);
      } 
      // If updating an existing rating
      else if (ratingId) {
        await ratingService.updateRating(ratingId, newRating);
        setRating(newRating);
      } 
      // If adding a new rating
      else {
        const savedRating = await ratingService.addRating(bookId, newRating);
        setRating(newRating);
        if (savedRating && savedRating._id) {
          setRatingId(savedRating._id);
        }
      }
    } catch (error) {
      console.error('Puanlama işlemi sırasında hata oluştu', error);
      alert('Puanlama sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={loading}
          className={`text-2xl transition-all duration-200 focus:outline-none ${
            star <= (hover || rating) ? 'text-sage scale-110 drop-shadow-md' : 'text-sage/30 hover:text-sage/70'
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingSystem;
