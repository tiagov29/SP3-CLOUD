const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombreProducto:{
        type:String,
    },
    precio:{
        type:Number,
    },
    quantity:{
        type:Number,
        default: 1,
    },
    productCost:{
        type:Number,
    },
    _id:{
        type: mongoose.ObjectId,
        required: true,
    }
});

const documentoSchema = new mongoose.Schema({
    userData: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    orderCost: {
        type: Number,
        default:0
    },
    username: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required:true
    },
    products: [productSchema],
    medioDePago: {
        type: String,
        default: "efectivo"
    },
    state: {
        type: String,
        default :"pendiente"
    }

});

documentoSchema.methods.ObtenerTotal = function(){
    return this.products.reduce((acum, currentValue) => acum + currentValue.productCost, 0);
}


const editarProducto = (products, ordenExistente) => {
    products.forEach(p => {
        const Peditar = ordenExistente.products.id(p.id);
        Peditar.quantity = p.quantity;
        Peditar.orderCost = Peditar.quantity * Peditar.precio
    });
    ordenExistente.orderCost = ordenExistente.ObtenerTotal();
}

const Orden = mongoose.model('Orden', documentoSchema);

module.exports = { Orden, editarProducto}