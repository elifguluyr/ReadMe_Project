const mongoose = require('mongoose');
require('../models/paylasim'); 
const Paylasim = mongoose.model('Paylasim');


const paylasimYap = async (req, res) => {
    try {
        const yeniPaylasim = new Paylasim({
            ...req.body, 
            user: req.auth._id, 
            date: new Date()
        });
        await yeniPaylasim.save();
        res.status(201).json(yeniPaylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Paylaşım oluşturulamadı", hata });
    }
};


const yorumYap = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId);
        
        if (!paylasim) {
            return res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        }
        const yeniYorum = {
            ...req.body, 
            user: req.auth._id, 
            date: new Date()
        };
        paylasim.comments.push(yeniYorum);
        await paylasim.save();
        res.status(201).json(yeniYorum);
    } catch (err) {
        res.status(400).json({ mesaj: "Yorum eklenemedi" });
    }
};


const paylasimSil = async (req, res) => {
    try {
        const { paylasimId } = req.params;
        const silinenPaylasim = await Paylasim.findByIdAndDelete(paylasimId);
        if (!silinenPaylasim) {
            return res.status(404).json({ "mesaj": "Silinmek istenen paylaşım bulunamadı!" });
        }
        res.status(200).json({
            "mesaj": "Paylaşım ve ona bağlı tüm yorumlar başarıyla silindi.",
            "silinenVeri": silinenPaylasim
        });
    } catch (hata) {
        res.status(400).json({ "mesaj": "Silme işlemi hatası", "hata": hata.message });
    }
};


const yorumSil = async (req, res) => {
    try {
        const { paylasimId, yorumId } = req.params;
        const paylasim = await Paylasim.findById(paylasimId);
        if (!paylasim) {
            return res.status(404).json({ mesaj: "Paylaşım bulunamadı!" });
        }
        const yorum = paylasim.comments.id(yorumId);
        if (!yorum) {
            return res.status(404).json({ mesaj: "Böyle bir yorum zaten yok!" });
        }
        yorum.deleteOne();
        await paylasim.save();
        res.status(200).json({ mesaj: "Yorum başarıyla silindi", paylasim });
    } catch (hata) {
        res.status(400).json({ mesaj: "Silme işlemi başarısız", hata: hata.message });
    }
};



const begen = async (req, res) => {
    try {
        const paylasim = await Paylasim.findByIdAndUpdate(
            req.params.paylasimId,
            { $inc: { likes: 1 } }, 
            { new: true }
        );
        res.status(200).json(paylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Beğenme işlemi başarısız", hata: hata.message });
    }
};


const yorumGuncelle = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId);
        const yorum = paylasim.comments.id(req.params.yorumId);
        
        if (!yorum) return res.status(404).json({ mesaj: "Yorum bulunamadı" });

        yorum.commentText = req.body.commentText; // Yeni şema alan adın
        await paylasim.save();
        res.status(200).json(paylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Güncelleme başarısız", hata: hata.message });
    }
};



const yorumlariListele = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId).select('comments');
        if (paylasim) {
            res.status(200).json(paylasim.comments);
        } else {
            res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        }
    } catch (hata) {
        res.status(400).json({ mesaj: "Listeleme başarısız", hata: hata.message });
    }
};

const paylasimGetir = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId);
        if (paylasim) {
            res.status(200).json(paylasim);
        } else {
            res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        }
    } catch (hata) {
        res.status(400).json({ mesaj: "ID formatı geçersiz", hata: hata.message });
    }
};


module.exports = { paylasimYap, yorumYap, paylasimSil, yorumSil,begen, yorumGuncelle, yorumlariListele, paylasimGetir };



