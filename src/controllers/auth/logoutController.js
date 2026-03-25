const logoutController = (req,res) => {
    res.status(200).json({
        ok:true,
        message: 'Ejemplo funcionando para control de logout'
    });
};

module.exports = {
    logoutController
};