const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'organizer', 'artist', 'staff', 'user'], 
        default: 'user' 
    }
}, { timestamps: true }); // Timestamps para saber cuándo se unieron

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

userSchema.methods.comprobarPassword = function(passwordFormulario) {
    return bcrypt.compare(passwordFormulario, this.password);
};

module.exports = model('User', userSchema);