const { response } = require('express');
const passwordHash = require('password-hash');
const { Usuario, Rol, Empresa } = require('../associations')

//Recuperar password
const { transport } = require('../../config/keys');
const util = require('util');
const fs = require('fs')
const { generarJWT } = require('../../helpers/generar-jwt');
const baseUrl = 'http://localhost:3000'; //(LOCAL)
const mailSender = 'sendmail@kuvesoft.cl';
const baseRoute = "./../../..";

const login = async(req, res = response) => {

    try {

        const { username, password } = req.body;
      
        
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({
            where: { username: username },
            include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }/* , { model: Empresa, as: 'empresa', attributes: ['nombre'] } */]
        });

        if ( !usuario ) {
            return res.status(404).json(
                { mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // SI el usuario está activo
        if ( usuario.estado === 0 ) {
            return res.status(403).json(
                { mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // Verificar la contraseña
        const validPassword = passwordHash.verify(password, usuario.password);

        if ( !validPassword ) {
            return res.status(400).json(
                { internalCode: 1, mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        return res.status(200).json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    } 

}

const changePassword = async(req, res = response) => {

    try {

        const { oldPass, newPass } = req.body
    
        const usuario = req.usuario;

        const validPassword = passwordHash.verify(oldPass, usuario.password);

        if(!validPassword) return res.status(401).json('Las Contraseñas no coinciden');

        let result = await Usuario.update({
            password: passwordHash.generate(newPass),
        }, {
            where: {
                id: usuario.id
            }
        });
        res.json(result);



    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    } 

}

//Envio de correo para poder restablecer la contraseña (parte 1-2)
const recuperarPassword = async (req = request, res = response) => {
    try{

        const usuario = req.usuarioEmail;

        // Generar el JWT
        const token = await generarJWT( usuario.id, '10m' );

        let filename = require.resolve(`${baseRoute}/src/assets/templates/recuperar-pass.html`);
        // Convert fs.readFile into Promise version of same    
        const readFile = util.promisify(fs.readFile);
        let html = await readFile(filename, 'utf-8');
        html = html.replace('{{nombre}}', usuario.nombre + ' ' + usuario.apellido);
        html = html.replace('{{fecha}}', new Date().toLocaleString('es-CL'));
        html = html.replace('{{enlace}}', `${baseUrl}/reestablecer/${token}`);
        // send mail with defined transport object
        let info = await transport.sendMail({
            from: `"Presición Verde" <${mailSender}>`,
            to: usuario.email, 
            subject: "RECUPERACIÓN DE CONTRASEÑA", 
            html: html,
        });
        return res.status(201).json(info);
    }

    catch(Error)
    {
        res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

//Se restablece la contraseña despues de recibir el correo
const reestablecerPassword = async (req , res ) => {
    try{

        const { newPass } = req.body;

        const{ usuario} = req.body;
    
        let result = await Usuario.update({
            password: passwordHash.generate(newPass),
        }, {
            where: {
                id: usuario.id
            }
        });
        //console.log(result);
        return res.status(201).json(result);
    }

    catch(Error)
    {
        res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

const empresas = async (req = request, res = response) => {
    try {
        
        const result = await Empresa.findAll({
            where: { estado: 1 }
        });

        return res.status(200).json(result)
    }

    catch (Error) {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

const verificarSesion = async(req, res = response) => {
    try {
        return res.json(true);
    } catch (error) {
        console.error(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    } 
}


module.exports = {
    login,
    changePassword,
    recuperarPassword,
    reestablecerPassword,
    empresas,
    verificarSesion,
}
