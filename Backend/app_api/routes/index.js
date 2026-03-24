const express = require('express');
const router = express.Router();
//elifin const kısmı
const { expressjwt: jwt } = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET || 'defaultsecret', 
  algorithms: ['HS256'],
  userProperty: 'auth'
});
const ctrlAuth = require('../controllers/Auth');
const ctrlUser = require('../controllers/User');



//efsanın const kısmı
const bookRoutes = require("./bookRoutes");
const ratingRoutes = require("./ratingRoutes");
const shelfRoutes = require("./shelfRoutes");





//verdanın const kısmı








//elifin router kısmı
router.post('/signup', ctrlAuth.signUp);
router.post('/login', ctrlAuth.login);
router.get('/profile/:userid', ctrlUser.getProfile);
router.put('/profile/update', auth, ctrlUser.updateProfile);
router.post('/follow/:userid', auth, ctrlUser.toggleFollow);
router.delete('/delete', auth, ctrlUser.deleteAccount);




//efsanın router kısmı
router.use("/", bookRoutes);
router.use("/ratings", ratingRoutes);
router.use("/shelves", shelfRoutes);

module.exports = router;

//verdanın router kısmı
