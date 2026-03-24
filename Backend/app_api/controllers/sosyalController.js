const mongoose = require('mongoose');
require('../models/paylasim'); 
const Paylasim = mongoose.model('Paylasim');


const paylasimYap = async (req, res) => {
    try {
        const yeniPaylasim = await Paylasim.create(req.body);
        res.status(201).json(yeniPaylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Paylaşım oluşturulamadı", hata });
    }
};


const yorumYap = async (req, res) => {
    try {
        console.log("Gelen Body:", req.body); 
        console.log("Gelen ID:", req.params.paylasimId);

        const paylasim = await Paylasim.findById(req.params.paylasimId);
        
        if (!paylasim) {
            return res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        }

        paylasim.yorumlar.push(req.body);
        await paylasim.save();
        res.status(201).json(paylasim);
    } catch (err) {
        console.error("Hatanın Tamamı:", err); 
        res.status(400).json({ mesaj: "Yorum eklenemedi", hata: err.message });
    }
};


const paylasimSil = async (req, res) => {
    try {
        
        const { paylasimId } = req.params;

        
        const silinenPaylasim = await Paylasim.findByIdAndDelete(paylasimId);

       
        if (!silinenPaylasim) {
            return res.status(404).json({ 
                "mesaj": "Silinmek istenen paylaşım bulunamadı!" 
            });
        }

       
        res.status(200).json({
            "mesaj": "Paylaşım ve ona bağlı tüm yorumlar başarıyla silindi.",
            "silinenVeri": silinenPaylasim
        });

    } catch (hata) {
        
        res.status(400).json({ 
            "mesaj": "Silme işlemi sırasında bir hata oluştu.", 
            "hata": hata.message 
        });
    }
};


module.exports = {
   
    paylasimSil
};


const yorumSil = async (req, res) => {
    try {
        const { paylasimId, yorumId } = req.params;

       
        const paylasim = await Paylasim.findById(paylasimId);
        if (!paylasim) {
            return res.status(404).json({ mesaj: "Paylaşım bulunamadı!" });
        }

        const yorum = paylasim.yorumlar.id(yorumId);
        if (!yorum) {
            return res.status(404).json({ mesaj: "Böyle bir yorum zaten yok!" });
        }

        
        yorum.deleteOne();
        await paylasim.save();

        res.status(200).json({ mesaj: "Yorum başarıyla silindi", paylasim });
    } catch (hata) {
        console.log("Silme Hatası:", hata);
        res.status(400).json({ mesaj: "Silme işlemi başarısız", hata: hata.message });
    }
};


const paylasimBegen = async (req, res) => {
    try {
        
        const paylasim = await Paylasim.findByIdAndUpdate(
            req.params.paylasimId,
            { $inc: { begeniSayisi: 1 } }, 
            { new: true }
        );
        res.status(200).json(paylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Beğenme işlemi başarısız", hata });
    }
};


const yorumGuncelle = async (req, res) => {
    try {
        const paylasim = await Paylasim.findById(req.params.paylasimId);
       
        const yorum = paylasim.yorumlar.id(req.params.yorumId);
        
        yorum.yorumMetni = req.body.yorumMetni;
        await paylasim.save();
        res.status(200).json(paylasim);
    } catch (hata) {
        res.status(400).json({ mesaj: "Güncelleme başarısız", hata });
    }
};


const yorumlariListele = async (req, res) => {
    try {
        
        const paylasim = await Paylasim.findById(req.params.paylasimId).select('yorumlar');
        if (paylasim) {
            res.status(200).json(paylasim.yorumlar);
        } else {
            res.status(404).json({ mesaj: "Paylaşım bulunamadı" });
        }
    } catch (hata) {
        res.status(400).json({ mesaj: "Listeleme başarısız", hata });
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
        res.status(400).json({ mesaj: "ID formatı geçersiz", hata });
    }
};



module.exports = { paylasimYap, yorumYap, paylasimSil, yorumSil,paylasimBegen, yorumGuncelle, yorumlariListele, paylasimGetir };



