const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
userSchema.pre('save', async function () {
    if (!this.isModified('password'));
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});
userSchema.methods.comprobarPassword = function(passwordFormulario) {
    return bcrypt.compare(passwordFormulario, this.password);
};
module.exports = mongoose.model('User', userSchema);