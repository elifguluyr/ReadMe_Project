const mongoose = require('mongoose');


const yorumSema = new mongoose.Schema({
    kullanici: { type: String, required: true }, 
    yorumMetni: { type: String, required: true }, 
    tarih: { type: Date, default: Date.now }
});


const paylasimSema = new mongoose.Schema({
    kullanici: { type: String, required: true },
    paylasimMetni: { type: String, required: true }, 
    begeniSayisi: { type: Number, default: 0 }, 
   
    yorumlar: [yorumSema] 
});


mongoose.model('Paylasim', paylasimSema);