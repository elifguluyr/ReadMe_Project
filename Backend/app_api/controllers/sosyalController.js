const mongoose = require('mongoose');
require('../models/paylasim'); 
const Paylasim = mongoose.model('Paylasim');
const redis = require('redis');
const amqp = require('amqplib');

// --- REDIS SETUP ---
let redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});
redisClient.on('error', (err) => console.log('Redis Client Hatası:', err.message));
redisClient.connect().catch(() => console.log("Redis'e bağlanılamadı, önbellekleme atlanacak."));

// --- RABBITMQ SETUP ---
let channel, connection;
async function connectRabbitMQ() {
    try {
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://127.0.0.1';
        connection = await amqp.connect(rabbitUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('like-queue', { durable: true });
        console.log("RabbitMQ 'like-queue' başarıyla bağlandı.");
        
        // Kuyrukta biriken beğeni mesajlarını dinleyip işliyoruz (Consumer)
        channel.consume('like-queue', async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                await processLikeMessage(data.paylasimId, data.userId);
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.log("RabbitMQ bağlanılamadı, beğeni işlemleri veritabanına senkron yazılacak.", err.message);
    }
}
connectRabbitMQ();

async function processLikeMessage(paylasimId, userId) {
    try {
        const paylasim = await Paylasim.findById(paylasimId);
        if (!paylasim) return;

        paylasim.likedBy = paylasim.likedBy || [];
        const likedByIds = paylasim.likedBy.map((id) => id.toString());
        const alreadyLiked = likedByIds.includes(userId);

        if (alreadyLiked) {
            paylasim.likedBy = paylasim.likedBy.filter((id) => id.toString() !== userId);
        } else {
            paylasim.likedBy.push(userId);
        }
        await paylasim.save();
        
        // Veritabanı değiştiği için önbelleği (cache) temizliyoruz
        if (redisClient.isReady) {
            await redisClient.del('paylasimlar_cache');
        }
    } catch(err) {
        console.error("Beğeni işlenirken hata:", err);
    }
}

// Çeşitli modifikasyonlarda Cache temizleme yardımcı fonksiyonu
const clearCache = async () => {
    if (redisClient.isReady) {
        await redisClient.del('paylasimlar_cache');
    }
}

const paylasimYap = async (req, res) => {
    try {
        const yeniPaylasim = new Paylasim({
            ...req.body, 
            user: req.auth._id, 
            date: new Date()
        });
        await yeniPaylasim.save();
        await clearCache(); // Cache temizle
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
        await clearCache(); // Cache temizle
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
        await clearCache(); // Cache temizle
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
        await clearCache(); // Cache temizle
        res.status(200).json({ mesaj: "Yorum başarıyla silindi", paylasim });
    } catch (hata) {
        res.status(400).json({ mesaj: "Silme işlemi başarısız", hata: hata.message });
    }
};

// BEĞENME (RabbitMQ Entegrasyonu)
const begen = async (req, res) => {
    try {
        const userId = req.auth._id.toString();
        const paylasimId = req.params.paylasimId;

        // RabbitMQ hazırsa işi kuyruğa atıp anında cevap dönüyoruz (Asenkron işleme)
        if (channel) {
            channel.sendToQueue('like-queue', Buffer.from(JSON.stringify({ paylasimId, userId })));
            return res.status(202).json({ mesaj: "Beğeni işlemi kuyruğa alındı (RabbitMQ)." });
        } else {
            // Eğer RabbitMQ yoksa direkt MongoDB'ye kaydet (Fallback)
            await processLikeMessage(paylasimId, userId);
            return res.status(200).json({ mesaj: "Beğeni işlemi başarıyla tamamlandı (Senkron)." });
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
        await clearCache(); // Cache temizle
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

// PAYLAŞIMLARI LİSTELEME (Redis Cache Entegrasyonu)
const paylasimlariListele = async (req, res) => {
    try {
        // 1. Önbellekte veri varsa, direkt onu dön
        if (redisClient.isReady) {
            const cachedPosts = await redisClient.get('paylasimlar_cache');
            if (cachedPosts) {
                console.log("Redis Cache HIT: Paylaşımlar önbellekten getirildi.");
                return res.status(200).json(JSON.parse(cachedPosts));
            }
        }

        // 2. Yoksa veritabanından çek
        console.log("Redis Cache MISS: Veritabanından paylaşımlar sorgulanıyor...");
        const paylasimlar = await Paylasim.find()
            .populate({ path: 'user', model: 'user', select: 'name email profileImage' })
            .populate({ path: 'comments.user', model: 'user', select: 'name' })
            .sort({ date: -1 });

        if (!paylasimlar || paylasimlar.length === 0) {
            return res.status(200).json({ mesaj: "Henüz hiç paylaşım yapılmamış.", veri: [] });
        }

        // 3. Çekilen veriyi 1 saatliğine (3600 sn) Redis'e kaydet
        if (redisClient.isReady) {
            await redisClient.setEx('paylasimlar_cache', 3600, JSON.stringify(paylasimlar));
        }

        res.status(200).json(paylasimlar);
    } catch (hata) {
        console.error("Hata Detayı:", hata); 
        res.status(400).json({ mesaj: "Paylaşımlar listelenirken hata oluştu", hata: hata.message });
    }
};
module.exports = { paylasimYap, yorumYap, paylasimSil, yorumSil, begen, yorumGuncelle, yorumlariListele, paylasimGetir, paylasimlariListele };

