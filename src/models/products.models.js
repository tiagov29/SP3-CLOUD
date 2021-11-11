const mongoose = require('mongoose');

const documentoSchema = new mongoose.Schema({
    nombreProducto: {
        type:String,
        required:true
    },
    precio: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Producto', documentoSchema);