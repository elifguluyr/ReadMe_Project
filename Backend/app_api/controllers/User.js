
const User = require('../models/users');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userid)
            .select('-hash -salt') 
            .populate('shelf'); 
        
        if (!user) return res.status(404).json({ status: "Kullanıcı bulunamadı" });
        res.status(200).json(user);
    } catch (err) {
        console.error('Profile Error:', err);
        res.status(500).json({ status: "Hata oluştu", error: err.message });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.auth._id; 
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body }, 
            { new: true } 
        ).select('-hash -salt');
        
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ status: "Güncelleme başarısız", error: err });
    }
};

const toggleFollow = async (req, res) => {
    const targetUserId = req.params.userid; 
    const myId = req.auth._id; 

    if (targetUserId === myId.toString()) {
        return res.status(400).json({ message: "Kendini takip edemezsin!" });
    }

    try {

        const me = await User.findById(myId);
        
        const isFollowing = me.following.includes(targetUserId);

        if (isFollowing) {
            await User.findByIdAndUpdate(myId, { $pull: { following: targetUserId } });
            return res.status(200).json({ message: "Takipten çıkıldı." });
        } else {
            await User.findByIdAndUpdate(myId, { $addToSet: { following: targetUserId } });
            return res.status(200).json({ message: "Takip edildi!" });
        }

    } catch (err) {
        res.status(500).json({ message: "İşlem başarısız", error: err.message });
    }
};

const deleteAccount = async (req, res) => {
    const myId = req.auth._id; 
    try {
        const deletedUser = await User.findByIdAndDelete(myId);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "Hesap zaten silinmiş veya bulunamadı." });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Hesap silinirken bir hata oluştu", error: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    toggleFollow,
    deleteAccount
};