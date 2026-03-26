const jwt = require('jsonwebtoken');
const JWT = (id, role) => { // <--- Recibe el rol
    return new Promise((resolve, reject) => {
        const payload = { id, role }; // <--- Lo mete en el token
        
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '8h'
        }, (err, token) => {
            if (err) reject('No se pudo generar el token');
            resolve(token);
        });
    });
};

module.exports = JWT;