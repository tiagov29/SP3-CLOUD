const mongoose = require('mongoose');
const { getMaxListeners } = require('./models/usuario.model.js');
const Usuario = require('./models/usuario.model.js');
const Producto = require('./models/products.models.js');
const MedioDePago = require('./models/payment.model.js');
const config = require('./config.js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const MONGOOSE_URL = config.module.MONGOOSE_URL;
const PASSWORDA = config.module.PASSWORDA;
const PASSWORDB = config.module.PASSWORDB;


(async () => {
    await mongoose.connect(MONGOOSE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true});
    console.log('conectado a la DB desde mongo !!!');
    const usuarioExiste = await Usuario.find();
    if(usuarioExiste.length == 0 ){
        const usuario1 = new Usuario({
            usuario : 'Santiago',
            email: 'sa@gmail.com',
            username: 'tiago',
            password: bcrypt.hashSync(PASSWORDA, 3),
            telefono: 3214568742,
            direccion: 'Avenida siempre viva casa 43',
            isAdmin : true,
            state: 'activo'
        })
        const usuario2 = new Usuario(
        {
            usuario : 'Evelio',
            email: 'Eve@gmail.com',
            username: 'evel',
            password: bcrypt.hashSync(PASSWORDB, 3),
            telefono: 3004536787,
            direccion: 'Avenida candeleo casa 12',
            isAdmin : false,
            state: 'activo'
        }
        )
    usuario1.save();
    usuario2.save();
    };
    const productoExiste = await Producto.find();
    if( productoExiste.length == 0 ){
        const Producto1 = new Producto({
            nombreProducto: 'Hamburguesa Tradicional',
            precio: 9000,
        })
        const Producto2 = new Producto({
            nombreProducto: 'Hamburguesa Triple queso',
            precio: 11000,
        })
        const Producto3 = new Producto(
        {
            nombreProducto: 'limonada',
            precio: 2000,
        })
        Producto1.save();
        Producto2.save();
        Producto3.save();

    };
    const existeMedioDePago = await MedioDePago.find();
    if ( existeMedioDePago.length == 0 ){
        const medioDePago1 = new MedioDePago({
            medioDePago: "efectivo",
        })
        const medioDePago2 = new MedioDePago({
            medioDePago: "tarjeta",
        })
        medioDePago1.save();
        medioDePago2.save();
    }


})();