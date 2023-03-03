const Usuario = require('./usuarios/Usuario.model')
const Rol = require('./rol/rol.model')
const Producto = require('./productos/productos.model')
const Categoria = require('./categorias/categorias.model')
const TipoMovimiento = require('./tipo_movimiento/tipo_movimiento.model')
const MovimientoStock = require('./movimiento_stock/movimiento_stock.model')
const LineaMovimiento = require('./linea_movimiento/linea_movimiento.model')
const Codigo = require('./codigos/codigo.model')
const Venta = require('./ventas/venta.model')
const LineaVenta = require('./ventas/linea_venta.model')

//Relacion rol - usuario (1-n)
Rol.hasMany(Usuario, { foreignKey: 'rol_id' })
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' })

Codigo.hasOne(Producto, { foreignKey: 'codigo_id' })
Producto.belongsTo(Codigo, { foreignKey: 'codigo_id', as: "codigo" })

//Relacion Producto - Categoria 
Categoria.hasMany(Producto, { foreignKey: 'categoria_id' })
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' })

TipoMovimiento.hasMany(MovimientoStock, { foreignKey: 'tipo_movimiento_id' })
MovimientoStock.belongsTo(TipoMovimiento, { foreignKey: 'tipo_movimiento_id', as: "tipo_movimiento" })

MovimientoStock.hasMany(LineaMovimiento, { foreignKey: 'movimiento_stock_id', as: 'linea_movimientos' })
LineaMovimiento.belongsTo(MovimientoStock, { foreignKey: 'movimiento_stock_id', as: "movimiento_stock" })

Producto.hasMany(LineaMovimiento, { foreignKey: 'producto_id' })
LineaMovimiento.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' })

Producto.hasMany(LineaVenta, { foreignKey: 'producto_id' })
LineaVenta.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto'  })

Venta.hasMany(LineaVenta, { foreignKey: 'venta_id', as :"linea_venta" })
LineaVenta.belongsTo(Venta, { foreignKey: 'venta_id', as :"ventas"})

module.exports = {
    Usuario,
    Rol,
    Producto,
    Categoria,
    TipoMovimiento,
    MovimientoStock,
    LineaMovimiento,
    Codigo,
    Venta,
    LineaVenta
}