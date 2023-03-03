const { response, request } = require('express');

const validarEmpresa = async( req = request, res = response, next ) => {

    try {

        const empresa = req.header('empresa');

        if ( !empresa ) {
            req.empresa = req.usuario.empresa_id;
        }
        
        req.empresa = parseInt(empresa);
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarEmpresa
}