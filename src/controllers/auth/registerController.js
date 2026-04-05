const user = require('../../models/users');

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'name, email y password son obligatorios' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (await user.findOne({ email: normalizedEmail })) {
            return res.status(400).json({ msg: 'Este usuario ya está registrado' });
        }

        // Registro público: SOLO para usuarios finales
        const newUser = new user({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: 'user'
        });

        const { _id, name: uName, email: uEmail, role } = await newUser.save();

        res.status(201).json({
            _id,
            name: uName,
            email: uEmail,
            role,
            accountType: 'end_user'
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor al registrar' });
    }
};

module.exports = { registerController };