const jwt = require('jsonwebtoken');
const user = require('../models/users'); 

const checkAuth = async (req, res, next) => {
    try {
        // 1. Extraer token (soporta x-token o Bearer)
        const token = req.header('x-token') || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) return res.status(401).json({ msg: 'Token no proporcionado' });

        // 2. Verificar token y obtener ID
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Buscar usuario (inyectamos el rol directamente para no depender solo del token)
        req.usuario = await user.findById(id).select('-password -__v');
        
        if (!req.usuario) return res.status(401).json({ msg: 'Usuario inexistente' });

        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token no válido';
        res.status(401).json({ msg: message });
    }
};

module.exports = checkAuth;