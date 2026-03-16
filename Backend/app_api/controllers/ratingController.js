const Rating = require("../models/Rating");

const addRating = async (req, res) => {
  try {
    const { bookId, rating } = req.body;

    const newRating = new Rating({
      bookId,
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

    const updatedRating = await Rating.findByIdAndUpdate(
      ratingId,
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

    const deletedRating = await Rating.findByIdAndDelete(ratingId);

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