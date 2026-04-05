/**
 * Factory middleware: checkRole('admin', 'organizer')
 * Debe usarse DESPUÉS de checkAuth, ya que depende de req.usuario
 */
const checkRole = (...roles) => (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ msg: 'Token no proporcionado' });

    if (!roles.includes(req.usuario.role)) {
        return res.status(403).json({ msg: 'No tienes permisos para esta acción' });
    }

    next();
};

module.exports = checkRole;
