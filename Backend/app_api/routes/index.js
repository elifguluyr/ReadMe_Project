const express = require('express');
const router = express.Router();
//elifin const kısmı
const ctrlAuth = require('../controllers/Auth');






//efsanın const kısmı







//verdanın const kısmı








//elifin router kısmı
router.post('/signup', ctrlAuth.signUp);
router.post('/login', ctrlAuth.login);








//efsanın router kısmı










//verdanın router kısmı











module.exports = router;