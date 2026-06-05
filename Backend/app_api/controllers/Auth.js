const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const redis = require("redis");
const amqp = require('amqplib');

let redisClient;
(async () => {
    try {
        redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
        redisClient.on("error", (error) => console.error(`[Redis] Auth Error : ${error}`));
        await redisClient.connect();
        console.log("[Redis] Auth/Logout işlemleri için bağlantı başarılı!");
    } catch (error) {
        console.error("[Redis] Auth bağlantı kurulamadı.", error);
    }
})();

const createResponse = function (res, status, content) {
    return res.status(status).json(content);
};

const sendWelcomeEmailToQueue = async (userData) => {
    try {
    
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabitmq:5672');
        const channel = await connection.createChannel();
        const queueName = 'email_queue';

        await channel.assertQueue(queueName, { durable: true }); 
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(userData)));
        
        console.log(`[RabbitMQ] Yeni kayıt kuyruğa eklendi: ${userData.email} 🐇`);
        
        // İşimiz bitince bağlantıyı kapatıyoruz
        setTimeout(() => { connection.close(); }, 500);
    } catch (error) {
        console.error('[RabbitMQ] Kuyruğa mesaj gönderilemedi:', error);
    }
};

const signUp = async function (req, res) {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            return createResponse(res, 400, 
                {status: "Tüm Alanlar Doldurulmalı!"});
        }
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.body.bio) {
            user.bio = req.body.bio;
        }
        
        if (req.body.profileImage) {
            user.profileImage = req.body.profileImage;
        }
        user.setPassword(req.body.password);
        const newUser = await user.save();

        await sendWelcomeEmailToQueue({
            type: 'WELCOME_EMAIL',
            email: newUser.email,
            name: newUser.name
        });
        
        const generatedToken = newUser.generateToken();
        return createResponse(res, 200, { token: generatedToken });
    } catch (err) {
        return createResponse(res, 400, 
            { status: "Kayıt Başarısız!", error: err.message || err.toString() || 'Unknown error' });
    }
};

const login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        return createResponse(res, 400, 
            { status: "Tüm Alanlar Doldurulmalı!" });
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return createResponse(res, 500, { status: "Sunucu hatası", error: err });
        }
        if (!user) {
            return createResponse(res, 400, { status: "Kullanıcı adı ya da şifre hatalı!" });
        }
        const generatedToken = user.generateToken();
        return createResponse(res, 200, { token: generatedToken });
    })(req, res);
};

const logout = async function (req, res) {
    try {
        // 1. Gelen istekten Token'ı al (Genelde "Bearer <token>" formatında gelir)
        let token = req.headers.authorization;
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        if (!token) {
            return createResponse(res, 400, { status: "Çıkış yapmak için geçerli bir token bulunamadı!" });
        }

        // 2. Token'ı Redis Kara Listesine (Blacklist) Ekle
        // Token'ın süresi boyunca (örn: 24 saat = 86400 saniye) Redis'te tutuyoruz
        if (redisClient && redisClient.isReady) {
            await redisClient.setEx(`blacklist_${token}`, 86400, "blacklisted");
            console.log("[Redis] Kullanıcı çıkış yaptı, bilet kara listeye eklendi!");
        }

        return createResponse(res, 200, { status: "Başarıyla çıkış yapıldı ve oturum kapatıldı." });
    } catch (err) {
        return createResponse(res, 500, { status: "Çıkış işlemi sırasında sunucu hatası", error: err.message });
    }
};

module.exports = {
    signUp,
    login,
    logout
};