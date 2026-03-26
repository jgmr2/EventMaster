const jwt = require('jsonwebtoken');
const user = require('../models/users'); 
const checkAuth = async (req, res, next) => {
    try {
        const token = req.header('x-token') || req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Token ausente'); 
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = await user.findById(decoded.id).select('-password -__v');
        if (!req.usuario) {
            throw new Error('Usuario no encontrado :C');
        }
        next();
    } catch (error) {
        res.status(401).json({ msg: 'No autorizado: Token inválido o ausente' });
    }
};

module.exports = checkAuth;