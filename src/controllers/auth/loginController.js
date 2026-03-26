const user = require('../../models/users');
const JWT = require('../../helpers/jwt'); 

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const u = await user.findOne({ email }); 
        return (!u || !(await u.comprobarPassword(password)))
            ? res.status(400).json({ msg: 'Credenciales incorrectas' })
            : res.json({ 
                _id: u._id, 
                name: u.name, 
                email: u.email, 
                token: await JWT(u._id) 
            });

    } catch (e) {
        console.error(`[Login Error]: ${e.message}`);
        res.status(500).json({ msg: 'Error en el servidor al iniciar sesión' });
    }
};

module.exports = { loginController };