const roleOptionsMap = {
    admin: ['dashboard', 'users:manage', 'places:manage', 'events:manage', 'reports:view'],
    organizer: ['events:manage', 'reports:view', 'reservations:event:view'],
    artist: ['reports:view', 'reservations:event:view'],
    staff: ['checkin:manage'],
    user: ['events:view', 'reservations:create', 'reservations:own:manage']
};

const getAccountType = (role) => (role === 'user' ? 'end_user' : 'admin_panel');

const meController = async (req, res) => {
    try {
        const { _id, name, email, role } = req.usuario;
        return res.json({
            _id,
            name,
            email,
            role,
            accountType: getAccountType(role),
            options: roleOptionsMap[role] || []
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error al obtener datos' });
    }
};

module.exports = { meController };