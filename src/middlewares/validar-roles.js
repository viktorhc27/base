const { response } = require('express')


const esSuperAdmin = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol_id, nombre } = req.usuario;
    
    if ( rol_id !== 1 ) {
        return res.status(401).json({
            msg: `${ nombre } no es Superadministrador - No puede hacer esto`
        });
    }
    next();
}

const esAdmin = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol_id, nombre } = req.usuario;
    
    if ( rol_id === 3) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }
    next();
}

const tieneRole = ( ...roles  ) => {
    return (req, res = response, next) => {
        
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if ( !roles.includes( req.usuario.rol_id ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        next();
    }
}
 
module.exports = {
    esSuperAdmin,
    esAdmin,
    tieneRole
}