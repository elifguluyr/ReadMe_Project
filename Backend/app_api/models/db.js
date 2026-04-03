var mongoose = require('mongoose');
var dbURI = process.env.MONGODB_URI || 'mongodb+srv://verdaer49_db_user:1234@trioreads.h1uhyll.mongodb.net/?appName=TrioReads';
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log(dbURI + ' adresindeki veritabanına bağlanıldı.');
});
mongoose.connection.on('error', function (err) {
    console.log('Veritabanı bağlantı hatası: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose bağlantısı kesildi.');
});
process.on('SIGINT', function () {
    mongoose.connection.close()
        .then(function () {
            console.log('Uygulama sonlandırıldı, Mongoose bağlantısı kapatıldı.');
            process.exit(0);
        })
        .catch(function (err) {
            console.error('Mongoose bağlantısı kapatılırken hata:', err);
            process.exit(1);
        });
});
require('./users');
