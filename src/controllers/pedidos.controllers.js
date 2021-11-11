const {Orden} = require('../models/pedidos.models.js');
const Producto = require('../models/products.models.js');
const MedioDePago = require('../models/payment.model.js');
const Usuario = require('../models/usuario.model.js')

exports.checkOrder = async(req,res) => {
    const ordenActual = await Orden.findOne({ username:req.user.usernameU , state : 'pendiente'});
    if (ordenActual){
        res.json(ordenActual)
    } else {
        res.json('en estos momentos no tienes ordenes pendientes')
    }
}

exports.getAllOrders = async(req,res) => {
    const ordenes = await Orden.find({ username: req.user.usernameU });
    console.log(ordenes)
    if (ordenes){
        res.json(ordenes)
    } else {
        res.json('Aun no tienes ordenes creadas ')
    }
}

exports.addProduct = async (req,res) => {
    const existeOrden = await Orden.findOne({ username: req.user.usernameU, state: 'pendiente' });
    try{
    const { _id } = req.params;
    const { nombreProducto , precio } = await Producto.findById(_id);
    const traerInfoProducto = (nombreProducto, precio, quantity) => {
        const productCost = quantity * precio;
        return{ _id: _id, precio, nombreProducto, productCost, quantity};
     };
    if ( existeOrden && nombreProducto){
        const quantityProducts = existeOrden.products.id(_id);
        if(!quantityProducts) {
            existeOrden.products.push(traerInfoProducto(nombreProducto, precio, 1));
            existeOrden.orderCost = existeOrden.ObtenerTotal();
            await existeOrden.save();
            res.json(existeOrden);
        }else
        {
        quantityProducts.quantity += 1;
        quantityProducts.productCost = quantityProducts.quantity * precio;
        existeOrden.orderCost = existeOrden.ObtenerTotal();
        await existeOrden.save();
        res.json(existeOrden);
        }
       }else {
           res.status(400).json(' id no encontrado')
       }

   } catch(e) {
       console.log(e);
   }
}

exports.deleteProduct = async (req,res) => {
    try {
        const existeOrden = await Orden.findOne({ username: req.user.usernameU, state:'pendiente' });
        if(existeOrden){
                const productoRemover = existeOrden.products.id(req.params._id);
                if(productoRemover.quantity > 1){
                    productoRemover.quantity = productoRemover.quantity -1;
                    productoRemover.productCost = productoRemover.quantity * productoRemover.precio;
                }else{
                    productoRemover.remove();
                }
                existeOrden.orderCost = existeOrden.ObtenerTotal();
                await existeOrden.save();
                res.json('producto Eliminado')
            } else {
                res.status(404).json('id no encontrado')
            }
        }
    catch (e){
        console.log(` el id del producto no es encontrado ${e}`)
    }
}

exports.updatePaymentMethod = async (req,res) => {
try{
    const { _id } = req.params;
    const existeOrden = await Orden.findOne ({ username: req.user.usernameU , state :'pendiente'})
    const existeMedioDePago = await MedioDePago.findById(_id);
    if(existeMedioDePago && existeOrden.state == "pendiente"){
    existeOrden.medioDePago = existeMedioDePago.medioDePago;
    existeOrden.save();
    res.json('medio de pago actualizado');
}else{
    res.status(404).json("debes verificar que el medio de pago ingresado este disponible en la aplicacion");
}
}catch(e){
    res.json(`se presenta un error tipo ${e}`)
}

}

exports.updateAddress = async (req, res) => {
    const { _id } = req.params;
    const { direccion } = req.body;
    const cambioDireccion = await Orden.findById(_id);
    if(cambioDireccion && cambioDireccion.state == 'pendiente'){
        cambioDireccion.direccion = direccion;
        cambioDireccion.save();
        res.json('direccion actualizada');
    } else {
        res.status(400).json(' verifica el id y recuerda que la direccion solo se puede modificar si la orden esta en estado pendiente ')
    }
}

exports.addAddress = async (req,res) => {
    try{
        const user = await Usuario.findOne({ username: req.user.usernameU });
        const direccionActualizada = user.direcciones.id(req.params._id);
        console.log(direccionActualizada);
        const cambioDireccion = await Orden.findOne({ username: req.user.usernameU, state: 'pendiente'});
        if (cambioDireccion){
            cambioDireccion.direccion = direccionActualizada.direccion;
            cambioDireccion.save();
            res.json(cambioDireccion);
        } else{
            res.json('orden no ubicada');
        }
    } catch(e){
        console.log(e);
        res.status(404).json(e);
    }
}

exports.confirmOrder = async (req,res) => {
    const { _id } = req.params;
    const { state } = req.body;
    const confirmarPedido = await Orden.findById(_id);
    if (confirmarPedido && state == 'confirmado' && confirmarPedido.state == 'pendiente'){
        confirmarPedido.state = state;
        confirmarPedido.save();
        res.json('Orden confirmada')
    } else {
        res.status(400).json(' verifica el id y recuerda que para confirmar debes enviar el estado confirmado ')
    }
}

exports.createOrder = async (req,res) => {
    const { direccion } = req.body;
    const { username } = await Usuario.findOne({ username: req.user.usernameU });
    const existeOrden = await Orden.findOne({ username : req.user.usernameU , state : "pendiente"});
    if (existeOrden){
        res.status(400).json('solo puedes tener una orden en estado pendiente a la vez');
    } else {
        const nuevaOrden = new Orden ({ username , direccion});
        nuevaOrden.save();
        res.json(`orden creada, ya puedes empezar a ingresar productos`)
    }
}

exports.updateOrderState = async (req,res) => {
    const { _id } = req.params;
    const { state } = req.body;
    if ( state == 'pendiente' || state == 'confirmado' || state == 'en preparacion' || state == 'enviado' || state == 'entregado' ) {
        confirmarOrden = await Orden.findById(_id);
        if(confirmarOrden){
            confirmarOrden.state = state;
            confirmarOrden.save();
            res.json('estado actualizado')
        } else {
            res.json('id no encontrado')
        }
    } else {
        res.json( " recuerda que los estados disponibles son :  'pendiente', 'confirmado', 'en preparacion', 'enviado', 'entregado' ")
    }
}

exports.getOrders = async (req, res) => {
    const ordenes = await Orden.find();
    res.json(ordenes);
}