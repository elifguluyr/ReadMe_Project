var mongoose=require('mongoose');
const crypto=require('crypto');
const jwt = require('jsonwebtoken');
const paylasim = require('./paylasim');
const user = new mongoose.Schema({
    email: {
        type:String,
        unique:true,
        required:true,
    },
    name: {
        type:String,
        required:true,
    },
    bio: {
        type: String,
        maxlength: 200, 
        default: "Yeni kitap kurdu."
    },
    profileImage: {
        type: String,
        default: "default_avatar.jpg" 
    },
    following: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    }],
    shelf: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shelf'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paylasim'
    }],
    
    hash: String,
    salt: String,
    token: {
        type:String,
    },
});
user.methods.setPassword=function(password){
    this.salt=crypto.randomBytes(16).toString('hex');
    this.hash=crypto
    .pbkdf2Sync(password,this.salt,1000,64,'sha512')
    .toString('hex');
};
user.methods.checkPassword=function(password){
    const hash=crypto
    .pbkdf2Sync(password,this.salt,1000,64,'sha512')
    .toString('hex');
    return this.hash===hash;
};
user.methods.generateToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name,
    },
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '1h' } // JWT süresini 1 saat yaptım
   );
};
module.exports = mongoose.model('user', user, 'users');