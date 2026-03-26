const meController = async (req, res) => {
    try {
        const { _id, name, email, role } = req.usuario;
        return res.json({ _id, name, email, role });
    } catch (e) {
        res.status(500).json({ msg: 'Error al obtener datos' });
    }
};

module.exports = { meController };