const { Router } = require('express');
const { check } = require('express-validator');
const { login, changePassword, recuperarPassword, reestablecerPassword, empresas, verificarSesion } = require('./sesion.controller');

const{
    validarCampos,
    validarJWT,
    tieneRole 
} = require('../../middlewares');

const { emailComprobar } = require('../../helpers/db-validators');

const router = Router();

router.post('/login', [
    check('username', 'El email es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

router.post('/change-password', [
    validarJWT,
    tieneRole(1, 2, 3),
    check('oldPass', 'El password es obligatorio').notEmpty(),
    check('newPass', 'El password es obligatorio').notEmpty(),
    validarCampos
], changePassword);

router.post('/recuperar-pass', [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom( emailComprobar ),
    validarCampos
],recuperarPassword);

router.post('/reestablecer', [
   // validarJWT,
    //tieneRole(1, 2, 3),
    check('newPass', 'El password es obligatorio').notEmpty(),
    validarCampos
],reestablecerPassword);

router.get('/empresas', [
    validarJWT,
    tieneRole(1, 2),
    validarCampos
], empresas);

router.get('/is-logged',
    validarJWT,
    verificarSesion,
);

module.exports = router;