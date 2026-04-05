const user = require('../../models/users');

const ALLOWED_ADMIN_ROLES = ['staff', 'artist'];

const createManagedAccountController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ msg: 'name, email, password y role son obligatorios' });
        }

        if (!ALLOWED_ADMIN_ROLES.includes(role)) {
            return res.status(400).json({ msg: `role inválido. Solo permitido: ${ALLOWED_ADMIN_ROLES.join(', ')}` });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const exists = await user.findOne({ email: normalizedEmail });
        if (exists) return res.status(400).json({ msg: 'Este usuario ya está registrado' });

        const newUser = new user({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role
        });

        const { _id, name: uName, email: uEmail, role: uRole } = await newUser.save();

        res.status(201).json({
            msg: 'Cuenta creada correctamente por admin',
            account: {
                _id,
                name: uName,
                email: uEmail,
                role: uRole,
                accountType: 'admin_panel'
            }
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error en el servidor al crear cuenta administrada' });
    }
};

module.exports = { createManagedAccountController };
