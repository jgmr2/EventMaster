const jwt = require('jsonwebtoken');

const JWT = (id) => new Promise((resolve, reject) => 
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '4h' }, (err, token) => 
        err ? (console.log(err), reject('No se pudo generar el token')) : resolve(token)
    )
);

module.exports = JWT;