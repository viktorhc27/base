const express = require('express');
const sequelize = require('../config/config');
const cors = require('cors');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3500;

        //Rutas
        this.usuariosPath = '/api/v1/usuario'
        this.sesionPath = '/api/v1/sesion'
        this.productosPath = '/api/v1/productos'
        this.categoriasPath = '/api/v1/categorias'
        this.tipo_movimientoPath = '/api/v1/tipo_movimiento'
        this.movimiento_stockPath = '/api/v1/movimiento_stock'
        this.linea_movimientoPath = '/api/v1/linea_movimiento'
        this.codigoPath = '/api/v1/codigo'
        this.ventaPath = '/api/v1/venta'
        this.reportePath = '/api/v1/reporte'

        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json({ limit: '50mb' }));

        this.app.use(express.urlencoded({
            limit: '50mb',
            extended: false
        }));

        // Habilita lectura de archivos via express (req.files).
        this.app.use(fileUpload());
    }

    conectarDB = async () => {
        try {

            await sequelize.sync({ force: false })
            console.log('Nos hemos conectado a la bd');

        } catch (error) {
            console.log(error);
            throw new Error('Error en conectar la base de datos.')
        }
    }

    routes() {
        this.app.use(this.sesionPath, require('../modules/sesion/sesion.routes'));
        this.app.use(this.usuariosPath, require('../modules/usuarios/usuarios.routes'));
        this.app.use(this.productosPath, require('../modules/productos/productos.routes'));
        this.app.use(this.categoriasPath, require('../modules/categorias/categorias.routes'));
        this.app.use(this.tipo_movimientoPath, require('../modules/tipo_movimiento/tipo_movimiento.routes'))
        this.app.use(this.movimiento_stockPath, require('../modules/movimiento_stock/movimiento_stock.routes'))
        this.app.use(this.linea_movimientoPath, require('../modules/linea_movimiento/linea_movimiento.routes'))
        this.app.use(this.codigoPath, require('../modules/codigos/codigo.routes'))
        this.app.use(this.ventaPath, require('../modules/ventas/venta.routes'))
        this.app.use(this.reportePath, require('../modules/reportes/reportes.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
