const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    direccion: {
        type: String,
    }
});

const documentoSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    direcciones: [addressSchema],
    isAdmin: {
        type:Boolean,
        default:false
    },
    state: {
        type:String,
        default: 'activo'
    }
});

module.exports = mongoose.model('Usuarios', documentoSchema);