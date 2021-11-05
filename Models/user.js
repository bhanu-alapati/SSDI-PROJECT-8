const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required:[true,'First Name cannot be empty']},
    lastName: {type: String, required:[true,'Last Name cannot be empty']},
    email: {type: String, required:[true,'Email cannot be empty'], unique: true},
    password: {type: String, required:[true,'Password cannot be empty']},
})

//Replace plain text password with a hash function before storing into database.
userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
        return next;
    bcrypt.hash(user.password,10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err))

});

//Implementing a method to compare login password with database password.

userSchema.methods.comparePassword = function(loginPassword){
   return bcrypt.compare(loginPassword,this.password)
}


module.exports = mongoose.model('User',userSchema);