const meController = (req,res) => {
    res.status(200).json({
        ok:true,
        message: 'Ejemplo funcionando para control de me'
    });
};

module.exports = {
    meController
};