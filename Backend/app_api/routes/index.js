const express = require('express');
const router = express.Router();
const redis = require("redis");

let redisClient;
(async () => {
  try {
    redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
    redisClient.on("error", (error) => console.error(`[Redis] Router Error : ${error}`));
    await redisClient.connect();
  } catch (error) {
    console.error("[Redis] Router bağlantı kurulamadı.", error);
  }
})();
//elifin const kısmı
const { expressjwt: jwt } = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET || 'defaultsecret', 
  algorithms: ['HS256'],
  userProperty: 'auth',
  isRevoked: async (req, token) => {
    if (redisClient && redisClient.isReady) {
      let rawToken = req.headers.authorization;
      if (rawToken && rawToken.startsWith('Bearer ')) {
        rawToken = rawToken.slice(7, rawToken.length);
      }
      
      const blacklisted = await redisClient.get(`blacklist_${rawToken}`);
      if (blacklisted) {
        console.log("[Redis] Kara listedeki (iptal edilmiş) bir biletle giriş engellendi! ");
        return true; 
      }
    }
    return false; 
  }
});
const ctrlAuth = require('../controllers/Auth');
const ctrlUser = require('../controllers/User');



//efsanın const kısmı
const bookRoutes = require("./bookRoutes");
const ratingRoutes = require("./ratingRoutes");
const shelfRoutes = require("./shelfRoutes");





//verdanın const kısmı
const ctrlSosyal = require('../controllers/sosyalController');







//elifin router kısmı
router.post('/signup', ctrlAuth.signUp);
router.post('/login', ctrlAuth.login);
router.post('/logout', ctrlAuth.logout);
router.get('/profile/:userid', ctrlUser.getProfile);
router.put('/profile/update', auth, ctrlUser.updateProfile);
router.post('/follow/:userid', auth, ctrlUser.toggleFollow);
router.delete('/delete', auth, ctrlUser.deleteAccount);




//efsanın router kısmı
router.use("/books", bookRoutes);
router.use("/ratings", auth,ratingRoutes);
router.use("/shelves", auth, shelfRoutes);



//verdanın router kısmı


router.post('/paylasim', auth, ctrlSosyal.paylasimYap);
router.post('/paylasim/:paylasimId/yorum', auth, ctrlSosyal.yorumYap);
router.post('/paylasim/:paylasimId/begen', auth, ctrlSosyal.begen);
router.put('/paylasim/:paylasimId/yorum/:yorumId', auth, ctrlSosyal.yorumGuncelle);
router.delete('/paylasim/:paylasimId/yorum/:yorumId', auth, ctrlSosyal.yorumSil);
router.delete('/paylasim/:paylasimId', auth, ctrlSosyal.paylasimSil);

router.get('/paylasim/:paylasimId/yorumlar', ctrlSosyal.yorumlariListele);
router.get('/paylasim', ctrlSosyal.paylasimlariListele);


module.exports = router;
