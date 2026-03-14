const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, done) => {
            User.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: "Kullanıcı bulunamadı." }); 
                    }
                    if (!user.checkPassword(password)) {
                        return done(null, false, { message: "Şifre hatalı." }); 
                    }
                    return done(null, user); 
                }).catch((err) => {
                    return done(err); 
            });
        }
    )
);