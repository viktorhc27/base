const { Router } = require('express');
const { check } = require('express-validator')

const {
    create,
    index,
    update,
    activate,
    deactivate,
    destroy,
    excel,
    index_rol_select,
    recuperarPassword
} = require('./usuarios.controller')

const { emailExisteUsuario, esRoleValido, existeUsuarioPorId, existeEmpresaPorId, emailComprobar} = require('../../helpers/db-validators');

const{
    validarCampos,
    validarJWT,
    esAdmin,
    esSuperAdmin,
    tieneRole } = require('../../middlewares');

const router = Router();

//create
router.post('/crear', [
    validarJWT,
    esAdmin,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('username', 'El nombre de usuario es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExisteUsuario ),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('rol_id').custom( esRoleValido ),
    check('empresa_id').custom( existeEmpresaPorId ).optional( { checkFalsy: true} ),
    validarCampos
], create);

router.post('/ver', [
    validarJWT,
    esAdmin
], index);

router.post('/excel', [
    validarJWT,
    esAdmin
], excel);

router.get('/ver-rol-select', [
    validarJWT,
    esAdmin
], index_rol_select);

router.put('/actualizar/:id', [
    validarJWT,
    esAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom( existeUsuarioPorId ),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('username', 'El nombre de usuario es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('rol_id').custom( esRoleValido ),
    check('empresa_id').custom( existeEmpresaPorId ).optional( { checkFalsy: true} ),
    validarCampos
],update);

router.delete('/activar/:id', [
    validarJWT,
    esAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],activate);

router.delete('/desactivar/:id', [
    validarJWT,
    esAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],deactivate);

router.delete('/eliminar/:id', [
    validarJWT,
    esSuperAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],destroy);

/*
router.post('/reestablecer', [
    validarJWT,
    check('newPass', 'El password es obligatorio').notEmpty(),
    validarCampos
],reestablecerPassword);*/

module.exports = router;