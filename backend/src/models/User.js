const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // for hashing passwords

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// ✅ Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10); // 10 salt rounds
    next();
});

module.exports = mongoose.model('User', userSchema);
