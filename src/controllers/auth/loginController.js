const user = require('../../models/users');
const JWT = require('../../helpers/jwt'); 

const roleOptionsMap = {
    admin: ['dashboard', 'users:manage', 'places:manage', 'events:manage', 'reports:view'],
    organizer: ['events:manage', 'reports:view', 'reservations:event:view'],
    artist: ['reports:view', 'reservations:event:view'],
    staff: ['checkin:manage'],
    user: ['events:view', 'reservations:create', 'reservations:own:manage']
};

const getAccountType = (role) => (role === 'user' ? 'end_user' : 'admin_panel');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'email y password son obligatorios' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const u = await user.findOne({ email: normalizedEmail }); 
        return (!u || !(await u.comprobarPassword(password)))
            ? res.status(400).json({ msg: 'Credenciales incorrectas' })
            : res.json({ 
                _id: u._id, 
                name: u.name, 
                email: u.email, 
                role: u.role,
                accountType: getAccountType(u.role),
                options: roleOptionsMap[u.role] || [],
                token: await JWT(u._id, u.role)
            });

    } catch (e) {
        console.error(`[Login Error]: ${e.message}`);
        res.status(500).json({ msg: 'Error en el servidor al iniciar sesión' });
    }
};

module.exports = { loginController };