const express = require('express');
const router = express.Router();
const ctrlAuth = require('../controllers/Auth');

router.post('/signup', ctrlAuth.signUp);
router.post('/login', ctrlAuth.login);

module.exports = router;