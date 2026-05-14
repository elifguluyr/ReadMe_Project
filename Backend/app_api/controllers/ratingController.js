const Rating = require("../models/Rating");
const amqp = require("amqplib");

// RabbitMQ Bağlantısı ve Kuyruk (Queue) Ayarları
let channel;
const queueName = "rating_tasks";

(async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq:5672");
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log("[RabbitMQ] Bağlantı başarılı ve kuyruk hazır!");

    // Bonus: Videoda sistemin çalıştığını göstermek için burada basit bir "İşçi (Worker)" çalıştırıyoruz.
    // (Normalde bu işçi başka bir sunucuda veya ayrı bir projede olurdu)
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        console.log(`\n[RabbitMQ WORKER] 📥 Yeni bir iş geldi: ${msg.content.toString()}`);
        console.log(`[RabbitMQ WORKER] ⚙️  Kitabın yeni ortalama puanı hesaplanıyor (Ağır İşlem)...`);
        
        // İşlemin 2 saniye sürdüğünü simüle ediyoruz
        setTimeout(() => {
            console.log("[RabbitMQ WORKER] ✅ İş başarıyla tamamlandı!\n");
            channel.ack(msg); // Mesajın işlendiğini RabbitMQ'ya bildiriyoruz
        }, 2000); 
      }
    });

  } catch (error) {
    console.error("[RabbitMQ] Bağlantı hatası:", error);
  }
})();

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

    // RabbitMQ'ya mesaj gönder (Kullanıcı bu ağır işlemlerin bitmesini beklemez, hemen cevap alır)
    if (channel) {
      const msgData = JSON.stringify({ bookId, rating, userId, timestamp: new Date() });
      channel.sendToQueue(queueName, Buffer.from(msgData), { persistent: true });
      console.log(`\n[RabbitMQ] 🚀 Mesaj anında kuyruğa atıldı! Kullanıcı bekletilmeyecek.`);
    }

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

const getUserRatings = async (req, res) => {
  try {
    const userId = req.auth._id;
    const ratings = await Rating.find({ user: userId });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({
      message: "Puanlar getirilemedi",
      error: error.message
    });
  }
};

module.exports = {
  addRating,
  updateRating,
  deleteRating,
  getUserRatings
};