const express = require('express');
const router = express.Router();
//elifin const kısmı
const ctrlAuth = require('../controllers/Auth');






//efsanın const kısmı
const bookRoutes = require("./bookRoutes");
const ratingRoutes = require("./ratingRoutes");
const shelfRoutes = require("./shelfRoutes");





//verdanın const kısmı








//elifin router kısmı
router.post('/signup', ctrlAuth.signUp);
router.post('/login', ctrlAuth.login);








//efsanın router kısmı
router.use("/", bookRoutes);
router.use("/ratings", ratingRoutes);
router.use("/shelves", shelfRoutes);







//verdanın router kısmı











module.exports = router;