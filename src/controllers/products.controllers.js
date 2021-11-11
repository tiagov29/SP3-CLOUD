const Producto = require('../models/products.models.js');
const clienteRedis = require('../redis.js');

exports.GetProducts = async (req,res) => {
    const productos = await Producto.find();
    clienteRedis.setex('Productos', 5 * 60, JSON.stringify(productos));
    res.json(productos);
}

exports.createProduct = async (req,res) => {
    const { nombreProducto, precio } = req.body;
    if(nombreProducto && precio) {
        const existeProducto = await Producto.findOne({ nombreProducto });
        if (existeProducto){
            res.status(404).json('el producto ya existe ')
        } else {
            const nuevoProducto = new Producto ( { nombreProducto, precio });
            nuevoProducto.save();
            clienteRedis.del('Productos');
            res.json(nuevoProducto);
        }
    }else{
        res.status(404).json("no se pudo ingresar el producto, verifica la solicitud")
    }
}

exports.updateProduct = async (req,res) => {
    const {nombreProducto, precio } = req.body;
    const { _id } = req.params;
    const existeProducto = await Producto.findById(_id);
    console.log(existeProducto);
    if(existeProducto){
        existeProducto.nombreProducto = nombreProducto;
        existeProducto.precio = precio;
        existeProducto.save();
        console.log(existeProducto)
        clienteRedis.del('Productos');
        res.json(existeProducto);
            } else {
        res.status(404).json('not found id')
    }
}

exports.deleteProduct = async (req,res) => {
    clienteRedis.del('Productos');
    try{
        const { _id } = req.params;
        const real = await Producto.findById(_id);
        console.log(real)
        if(real){
            await Producto.deleteOne({ _id: _id });
            clienteRedis.del('Productos');
            res.json('producto eliminado ');
        } else {
            res.status(400).json('not found id');
        }
    } catch(e){
        res.status(500).json(e)
    }
}