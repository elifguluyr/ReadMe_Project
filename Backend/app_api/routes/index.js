const express = require('express');
const router = express.Router();
//elifin const kısmı
const ctrlAuth = require('../controllers/Auth');






//efsanın const kısmı







//verdanın const kısmı
const ctrlSosyal = require('../controllers/sosyalController');







//elifin router kısmı
router.post('/signup', ctrlAuth.signUp);
router.post('/login', ctrlAuth.login);








//efsanın router kısmı










//verdanın router kısmı


router.post('/paylasim', ctrlSosyal.paylasimYap);


router.post('/paylasim/:paylasimId/yorum', ctrlSosyal.yorumYap);


router.delete('/paylasim/:paylasimId/yorum/:yorumId', ctrlSosyal.yorumSil);


router.delete('/paylasim/:paylasimId', ctrlSosyal.paylasimSil);


router.post('/paylasim/:paylasimId/begen', ctrlSosyal.paylasimBegen);


router.put('/paylasim/:paylasimId/yorum/:yorumId', ctrlSosyal.yorumGuncelle);

router.get('/paylasim/:paylasimId/yorumlar', ctrlSosyal.yorumlariListele);//belirli bir paylaşımın yorumlarını listeleme
router.get('/paylasim/:paylasimId', ctrlSosyal.paylasimGetir);

module.exports = router;