const registerController = (req,res) => {
    res.status(200).json({
        ok:true,
        message: 'Ejemplo funcionando para control de registro'
    });
};

module.exports = {
    registerController
};