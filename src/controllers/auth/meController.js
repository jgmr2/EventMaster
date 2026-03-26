const meController = async (req, res) => {
    try {
        return req.usuario 
            ? res.json({ _id: req.usuario._id, name: req.usuario.name, email: req.usuario.email }) 
            : res.status(404).json({ msg: 'Usuario no encontrado' });
    } catch (e) {
        console.error(`[Me Error]: ${e.message}`);
        res.status(500).json({ msg: 'Error en el servidor al obtener datos del usuario' });
    }
};

module.exports = { meController };