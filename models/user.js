//create model of user Document
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:String,
    role: { type: String, enum: ['employee', 'manager', 'admin'], required: true }
})

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,10)
    }
    next();
})


const User = mongoose.model('User',userSchema)

module.exports = User; 