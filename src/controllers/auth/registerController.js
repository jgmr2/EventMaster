const user = require('../../models/users');

const registerController = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        
        if (await user.findOne({ email })) 
            return res.status(400).json({ msg: 'Usuario ya registrado' });

        // Protegemos el rol: solo permitimos los roles básicos en el registro público
        // Si no viene rol o intentan ponerse 'admin', forzamos 'user'
        const finalRole = ['organizer', 'artist', 'user'].includes(role) ? role : 'user';

        const newUser = new user({ name, email, password, role: finalRole });
        const { _id, name: uName, email: uEmail, role: uRole } = await newUser.save();

        res.status(201).json({ _id, name: uName, email: uEmail, role: uRole });
    } catch (e) {
        res.status(500).json({ msg: 'Error al registrar' });
    }
};

module.exports = { registerController };