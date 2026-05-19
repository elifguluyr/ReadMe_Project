const mongoose = require('mongoose');
require('../models/paylasim'); 
const Paylasim = mongoose.model('Paylasim');
const redis = require('redis');
const amqp = require('amqplib');

let amqpChannel = null;

// Redis Client Setup
let redisClient;
(async () => {
    try {
        redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
        redisClient.on("error", (error) => console.error(`Redis Error: ${error}`));
        await redisClient.connect();
    } catch (err) {
        console.error("Redis bağlantı hatası:", err);
    }
})();

const clearCache = async () => {
    try {
        if (redisClient && redisClient.isReady) {
            await redisClient.del('posts_cache');
        }
    } catch (err) {
        console.error("Redis cache temizleme hatası:", err);
    }
};


const paylasimYap = async (req, res) => {
    try {
        const yeniPaylasim = new Paylasim({
            ...req.body, 
            user: req.auth._id, 
            date: new Date()
        });
        await yeniPaylasim.save();
        await clearCache();
        res.status(201).json(yeniPaylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Paylaşım oluşturulamadı", hata });
    }
};

const yorumYap = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId);
        if (!paylasim) return res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        
        const yeniYorum = {
            ...req.body, 
            user: req.auth._id, 
            date: new Date()
        };
        paylasim.comments.push(yeniYorum);
        await paylasim.save();
        await clearCache();
        res.status(201).json(yeniYorum);
    } catch (err) {
        res.status(400).json({ mesaj: "Yorum eklenemedi" });
    }
};

const paylasimSil = async (req, res) => {
    try {
        const { paylasimId } = req.params;
        const silinenPaylasim = await Paylasim.findByIdAndDelete(paylasimId);
        if (!silinenPaylasim) {
            return res.status(404).json({ "mesaj": "Silinmek istenen paylaşım bulunamadı!" });
        }
        await clearCache();
        res.status(200).json({
            "mesaj": "Paylaşım ve ona bağlı tüm yorumlar başarıyla silindi.",
            "silinenVeri": silinenPaylasim
        });
    } catch (hata) {
        res.status(400).json({ "mesaj": "Silme işlemi hatası", "hata": hata.message });
    }
};

const yorumSil = async (req, res) => {
    try {
        const { paylasimId, yorumId } = req.params;
        const paylasim = await Paylasim.findById(paylasimId);
        if (!paylasim) return res.status(404).json({ mesaj: "Paylaşım bulunamadı!" });
        
        const yorum = paylasim.comments.id(yorumId);
        if (!yorum) return res.status(404).json({ mesaj: "Böyle bir yorum zaten yok!" });
        
        yorum.deleteOne();
        await paylasim.save();
        await clearCache();
        res.status(200).json({ mesaj: "Yorum başarıyla silindi", paylasim });
    } catch (hata) {
        res.status(400).json({ mesaj: "Silme işlemi başarısız", hata: hata.message });
    }
};

// BEĞENME
const begen = async (req, res) => {
    try {
        const userId = req.auth._id.toString();
        const paylasimId = req.params.paylasimId;

        const message = { postId: paylasimId, userId: userId };

        try {
            if (!amqpChannel) throw new Error("RabbitMQ channel hazır değil");
            
            amqpChannel.sendToQueue('like_queue', Buffer.from(JSON.stringify(message)));
            
            // Kullanıcıya hemen cevap dönülür (Veritabanı beklenmeden)
            return res.status(200).json({ mesaj: "Beğeni alındı" });
        } catch (queueError) {
            console.error("RabbitMQ hatası, senkron beğeniliyor...", queueError);
            
            // Fallback: RabbitMQ çalışmazsa senkron yap
            const paylasim = await Paylasim.findById(paylasimId);
            if (!paylasim) return res.status(404).json({ mesaj: "Paylaşım bulunamadı" });

            paylasim.likedBy = paylasim.likedBy || [];
            const likedByIds = paylasim.likedBy.map((id) => id.toString());
            const alreadyLiked = likedByIds.includes(userId);

            if (alreadyLiked) {
                paylasim.likedBy = paylasim.likedBy.filter((id) => id.toString() !== userId);
            } else {
                paylasim.likedBy.push(userId);
            }
            await paylasim.save();
            await clearCache();

            return res.status(200).json({ mesaj: "Beğeni işlemi başarıyla tamamlandı.", paylasim });
        }
    } catch (hata) {
        res.status(400).json({ mesaj: "Beğenme isteği işlenemedi", hata: hata.message });
    }
};

const yorumGuncelle = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId);
        const yorum = paylasim.comments.id(req.params.yorumId);
        
        if (!yorum) return res.status(404).json({ mesaj: "Yorum bulunamadı" });

        yorum.commentText = req.body.commentText; 
        await paylasim.save();
        await clearCache();
        res.status(200).json(paylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Güncelleme başarısız", hata: hata.message });
    }
};

const yorumlariListele = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId)
            .select('comments')
            .populate({ path: 'comments.user', model: 'user', select: 'name' });
        if (paylasim) {
            res.status(200).json(paylasim.comments);
        } else {
            res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        }
    } catch (hata) {
        res.status(400).json({ mesaj: "Listeleme başarısız", hata: hata.message });
    }
};

const paylasimGetir = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId)
            .populate({ path: 'user', model: 'user', select: 'name email profileImage' })
            .populate({ path: 'comments.user', model: 'user', select: 'name profileImage' });
        if (paylasim) {
            res.status(200).json(paylasim);
        } else {
            res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        }
    } catch (hata) {
        res.status(400).json({ mesaj: "ID formatı geçersiz", hata: hata.message });
    }
};

// PAYLAŞIMLARI LİSTELEME
const paylasimlariListele = async (req, res) => {
    try {
        const cacheKey = 'posts_cache';

        try { //redis
            if (redisClient && redisClient.isReady) {
                const cachedPosts = await redisClient.get(cacheKey);
                if (cachedPosts) {
                    // Redis'te varsa hızlıca dön
                    return res.status(200).json(JSON.parse(cachedPosts));
                }
            }
        } catch (redisErr) {
            console.error("Redis Cache Error:", redisErr);
        }

        const paylasimlar = await Paylasim.find()
            .populate({ path: 'user', model: 'user', select: 'name email profileImage' })
            .populate({ path: 'comments.user', model: 'user', select: 'name' })
            .sort({ date: -1 });

        if (!paylasimlar || paylasimlar.length === 0) {
            return res.status(200).json({ mesaj: "Henüz hiç paylaşım yapılmamış.", veri: [] });
        }

        try {
            if (redisClient && redisClient.isReady) {
                // Redis'e kaydet (1 saat geçerli: 3600 saniye)
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(paylasimlar));
            }
        } catch (redisErr) {
            console.error("Redis Cache Set Error:", redisErr);
        }

        res.status(200).json(paylasimlar);
    } catch (hata) {
        console.error("Hata Detayı:", hata); 
        res.status(400).json({ mesaj: "Paylaşımlar listelenirken hata oluştu", hata: hata.message });
    }
};
// Worker Setup (Controller içine gömülü)
const initRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        
        connection.on("error", (err) => {
            console.error("RabbitMQ Connection Error:", err);
            amqpChannel = null;
        });
        connection.on("close", () => {
            console.error("RabbitMQ Connection Closed.");
            amqpChannel = null;
        });

        amqpChannel = await connection.createChannel();
        await amqpChannel.assertQueue('like_queue', { durable: true });

        console.log("RabbitMQ: like_queue kuyruğu dinleniyor ve yayıncı hazır...");

        amqpChannel.consume('like_queue', async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                const { postId, userId } = message;

                try {
                    const paylasim = await Paylasim.findById(postId);
                    if (paylasim) {
                        paylasim.likedBy = paylasim.likedBy || [];
                        const likedByIds = paylasim.likedBy.map((id) => id.toString());
                        const alreadyLiked = likedByIds.includes(userId);

                        if (alreadyLiked) {
                            paylasim.likedBy = paylasim.likedBy.filter((id) => id.toString() !== userId);
                        } else {
                            paylasim.likedBy.push(userId);
                        }
                        await paylasim.save();
                        await clearCache(); // Cache güncelle
                        console.log(`Worker: Beğeni işlemi başarılı. Post: ${postId}, User: ${userId}`);
                    }
                    amqpChannel.ack(msg);
                } catch (err) {
                    console.error("Worker: MongoDB işlem hatası:", err);
                    amqpChannel.nack(msg, false, false);
                }
            }
        });
    } catch (err) {
        console.error("RabbitMQ Başlangıç hatası (Sistem senkron devam edecek):", err);
    }
};

initRabbitMQ();

module.exports = { paylasimYap, yorumYap, paylasimSil, yorumSil, begen, yorumGuncelle, yorumlariListele, paylasimGetir, paylasimlariListele };

