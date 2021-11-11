const mongoose = require('mongoose');

const documentoSchema = new mongoose.Schema({
    medioDePago:{
        type:String,
        required: true
    }
})
module.exports = mongoose.model( 'MedioDePago', documentoSchema);