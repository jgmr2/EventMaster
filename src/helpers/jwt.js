const jwt = require('jsonwebtoken');

const JWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '3d', 
    });
};

module.exports = JWT;