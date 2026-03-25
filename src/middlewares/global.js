const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuarios');
const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error(); 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = await Usuario.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ msg: 'No autorizado: Token inválido o ausente' });
    }
};
module.exports = checkAuth;