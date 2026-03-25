const loginController = (req,res) => {
    res.status(200).json({
        ok:true,
        message: 'Ejemplo funcionando para control de login'
    });
};

module.exports = {
    loginController
};