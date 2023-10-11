const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please provide name"]
    },
    email:{
        type:String,
        required:[true, "Please provide email"],
        unique:true,
        match:[/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i]
    },
    password:{
        type:String,
        required:[true, "Please provide password"],
    },
    isAvatarImageSet:{
        type:Boolean,
        default:false
    },
    avatarImage:{
        type:String,
        default:""
    }
})

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.genAccessJWT = function(){
    return jwt.sign({id:this._id, name:this.name},process.env.ACCESS_KEY,{expiresIn:'30m'})
}
userSchema.methods.genRefreshJWT = function(){
    return jwt.sign({id:this._id, name:this.name},process.env.REFRESH_KEY,{expiresIn:'5d'})
}
userSchema.methods.comparePwd = async function(password){
    const isMatch = await bcrypt.compare(password,this.password);
    return isMatch
}
const User = mongoose.model("User", userSchema)

module.exports = User