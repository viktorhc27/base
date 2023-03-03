const { response, request } = require('express');
const { Usuario, Rol, Empresa } = require('../associations')
const { kuv_lazy_table } = require('../../helpers/kuv-lazy-table');
const  passwordHash = require('password-hash');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

const create = async (req = request, res = response) => {

    try {
        req.body.password = passwordHash.generate(req.body.password)

        const usuario = await Usuario.create( req.body )
    
        return res.status(201).json(usuario);
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const index = async (req = request, res = response) => {
    try{

        if (req.usuario.rol_id != 1) {
            req.body.filtered = true
            req.body.filters.push({ column: 'rol_id', value: 1, op: 'ne' })
        }

        if (req.body.sorted) {
            if (req.body.sorted_by == 'rol') {
                req.body.order = [['rol', 'nombre', (req.body.sorted_asc) ? 'ASC' : 'DESC']]
            }
        }

        let opts = kuv_lazy_table(req.body).opts
        let opts_count = kuv_lazy_table(req.body).opts_count

        opts.attributes = ['id', 'nombre', 'apellido', 'username', 'email', 'fono', 'estado', 'rol_id', 'empresa_id']

        opts.include = [{ model: Rol, as: 'rol', attributes: ['nombre'] }, { model: Empresa, as: 'empresa', attributes: ['nombre'] }],
        opts_count.include = { model: Rol, as: 'rol' }

        const result = await Usuario.findAll(opts);
        const count = await Usuario.count(opts_count);

        return res.status(200).json({elements: result, count: count})
    }

    catch(Error)
    {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}


const update = async (req, res = response) => {

    try {
        const id_usuario  = req.params.id;
        const body = req.body;

        const result = await Usuario.update( body, { where: { id: id_usuario } } );

        return res.status(200).json( result );

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}

const deactivate = async (req = request, res = response) => {
    try{

        const id_usuario  = req.params.id;

        const result = await Usuario.update( { estado: 0 }, { where: { id: id_usuario } } );

        return res.status(200).json( result );

    }

    catch(Error)
    {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

const activate = async (req = request, res = response) => {
    try{

        const id_usuario  = req.params.id;

        const result = await Usuario.update( { estado: 1 }, { where: { id: id_usuario } } );

        return res.status(200).json( result );

    }

    catch(Error)
    {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

const destroy = async (req = request, res = response) => {
    try{

        const id_usuario  = req.params.id;

        const result = await Usuario.destroy( { where: { id: id_usuario } } );

        return res.status(200).json( result );

    }

    catch(Error)
    {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

const index_rol_select = async (req = request, res = response) => {
    try{

        const result = await Rol.findAll({ 
            attributes: ['id', 'nombre'],
            where: { estado: 1, id: { [Op.ne]: 1} }
        });

        return res.status(200).json(result)
    }

    catch(Error)
    {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

const excel = async (req = request, res = response) => {
    try{

        const workbook = new ExcelJS.Workbook();

        let worksheet = workbook.addWorksheet('Usuarios');

        worksheet.columns = [
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido', key: 'apellido' },
            { header: 'Nombre de  Usuario', key: 'username' },
            { header: 'Rol', key: 'rol' },
            { header: 'Empresa', key: 'empresa' },
            { header: 'Correo', key: 'email' },
            { header: 'Fono', key: 'fono' }
        ];

        if (req.body.sorted) {
            if (req.body.sorted_by == 'rol') {
                req.body.order = [['rol', 'nombre', (req.body.sorted_asc) ? 'ASC' : 'DESC']]
            }
        }

        let opts = kuv_lazy_table(req.body).opts

        opts.attributes = ['id', 'nombre', 'apellido', 'username', 'email', 'fono', 'estado', 'rol_id', 'empresa_id']

        opts.include = [{ model: Rol, as: 'rol', attributes: ['nombre'] }, { model: Empresa, as: 'empresa', attributes: ['nombre'] }]

        let usuarios_excel = [];

        const result = await Usuario.findAll(opts);

        for (let index = 0; index < result.length; index++) {
            usuarios_excel.push( { nombre: result[index].nombre, apellido: result[index].apellido, username: result[index].username, rol: result[index].rol.nombre, empresa: (result[index].empresa_id) ? result[index].empresa.nombre : null, email: result[index].email, fono: result[index].fono })
        }

        worksheet.addRows(usuarios_excel);

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/xlsx');
        res.setHeader('Content-disposition', `attachment; filename=document.xlsx`);
        res.send(buffer);

    }

    catch(Error)
    {
        return res.status(500).json({
            msg: 'Hable con el administrador',
            Error
        })
    }
}

module.exports = {
    create,
    index,
    update,
    activate,
    deactivate,
    destroy,
    index_rol_select,
    excel
}