const Rating = require("../models/Rating");

const addRating = async (req, res) => {
  try {
    const { bookId, rating } = req.body;
    const userId = req.auth._id;
    if(!rating) {
      return res.status(400).json({
        message: "Puan zorunludur."
      });
    }
    if(rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Puan 1 ile 5 arasında olmalıdır."
      });
    }

    const newRating = new Rating({
      bookId,
      user: userId,
      rating
    });

    const savedRating = await newRating.save();

    res.status(201).json(savedRating);
  } catch (error) {
    res.status(500).json({
      message: "Puan eklenemedi",
      error: error.message
    });
  }
};
const updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating } = req.body;
    const userId = req.auth._id;

    const updatedRating = await Rating.findByIdAndUpdate(
      { _id: ratingId, user: userId },
      { rating },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(404).json({ message: "Puan bulunamadı" });
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({
      message: "Puan güncellenemedi",
      error: error.message
    });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.auth._id;

    const deletedRating = await Rating.findByIdAndDelete({ _id: ratingId, user: userId });

    if (!deletedRating) {
      return res.status(404).json({
        message: "Puan bulunamadı"
      });
    }

    res.status(200).json({
      message: "Puan silindi"
    });

  } catch (error) {
    res.status(500).json({
      message: "Puan silinemedi",
      error: error.message
    });
  }
};

module.exports = {
  addRating,
  updateRating,
  deleteRating
};