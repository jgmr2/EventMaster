const user = require('../../models/users');

const registerController = async (req,res) => {
    const { email } = req.body;
    if (await user.findOne({ email })) 
        return res.status(400).json({ msg: 'Este usuario ya está registrado' });

    try {
        const { _id, name, email: uEmail } = await new user(req.body).save();
        res.json({ _id, name, email: uEmail });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor al registrar' });
    }
};

module.exports = {
    registerController
};