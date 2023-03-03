
const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarEmpresa = require('../middlewares/validar-empresa');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarEmpresa
}