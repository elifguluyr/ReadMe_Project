const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const createResponse = function (res, status, content) {
    return res.status(status).json(content);
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
        user.setPassword(req.body.password);
        const newUser = await user.save();
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

module.exports = {
    signUp,
    login
};