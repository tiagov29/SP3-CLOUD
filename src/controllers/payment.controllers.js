const MedioDePago = require('../models/payment.model.js')

exports.getPaymentMethods = async (req,res) => {
    const getPayments = await MedioDePago.find();
    res.json(getPayments);
}

exports.createPaymentMethod = async ( req, res) => {
    const { medioDePago } = req.body;
    const existeMedioDePago = await MedioDePago.findOne({ medioDePago });
    if(existeMedioDePago){
        res.json("este medio de pago ya esta disponible en la aplicacion ")
    }else{
    const nuevoMedioDePago = new MedioDePago ( { medioDePago });
    nuevoMedioDePago.save()
        res.status(404).json(nuevoMedioDePago);
    }
}

exports.updatePaymentMethod = async (req, res ) => {
    try {
        const { _id } = req.params;
        const { medioDePago } = req.body;
        const existeMedioDePago = await MedioDePago.findById(_id);
        if(existeMedioDePago){
        existeMedioDePago.medioDePago = medioDePago;
        existeMedioDePago.save();
        res.json(existeMedioDePago)
        }else{
        res.status(404).json('medio de pago no encontrado, verificar id')
        }
    } catch (e) {
        console.log(`tenemos dificultades al ejecutar esta solicitud ${e}`)
    }
}

exports.deletePaymentMethod = async ( req, res) => {
    try{
        const { _id } = req.params;
        const existeMedioDePago = await MedioDePago.findById(_id);
        if (existeMedioDePago){
        await MedioDePago.deleteOne({_id:req.params});
        res.json("medio de pago eliminado");
        } else {
        res.status(400).json(' medio de pago no encontrado, verificar id');
        };
    }catch (e){
        console.log(`se presenta el siguiente inconveniente ${e}`)
    }
}