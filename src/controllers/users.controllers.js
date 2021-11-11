const Usuario = require('../models/usuario.model.js');

exports.GetUsers = async (req,res) =>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
}

exports.deleteUser = async(req, res) => {
    const { _id } = req.params;
    const real = await Usuario.findById(_id);
    if(real){
        await Usuario.deleteOne({ _id : req.params });
        res.json('usuario Eliminado');
    } else {
        res.status(400).json("id desconocido");
    }
}

exports.actualizarUser = async (req, res) => {
    try{
        const { usuario, email, username, password, telefono, direccion, isAdmin } = req.body;
        const { _id } = req.params;
        const real = await Usuario.findById(_id);
        if(real){
            real.usuario = usuario;
            real.email = email;
            real.username = username;
            real.password = password;
            real.telefono = telefono;
            real.direccion = direccion;
            real.isAdmin = isAdmin;
            real.save();
            res.json(real);
        }else {
            res.status(404).json(' id desconocido');
        }

    } catch(e) {
        console.log(`se presenta el siguiente error ${e}`)
    }
}

exports.actualizarUserState = async (req, res) => {
    try{
        const { _id } = req.params;
        const { state } = req.body;
        const real = await Usuario.findById(_id);
        console.log(real)
        if(real){
            real.state = state;
            real.save();
            res.json(`el nuevo estado del usuario es ${state}`);
        }
    }catch(e){
        res.status(404).json(e.details[0].message)
    }
}

exports.agregarDireccion = async(req,res) => {
    try{
        const { direccion } = req.body;
        const user = await Usuario.findOne({ username: req.user.usernameU});
        user.direcciones.push({ direccion });
        user.save();
        res.json(user.direcciones)
    }catch(e){
        res.status(404).json(e.details[0].message)
    }
}

exports.verDirecciones = async(req,res) => {
    try{
        const user = await Usuario.findOne({username: req.user.usernameU});
        res.json(user.direcciones)
    }catch(e){
        res.status(404).json(e.details[0].message)
    }
}

exports.actualizarDirecciones = async(req,res) => {
    try{
        const nuevaDireccion = req.body;
        const user = await Usuario.findOne({ username: req.user.usernameU });
        const direccionAmodificar = user.direcciones.id(req.params._id);
        if(direccionAmodificar){
            direccionAmodificar.direccion = nuevaDireccion.direccion;
            await user.save();
            res.json(user)
        }else{
            res.json('direccion no encontrada')
        }
    }catch(e){
        res.status(404).json(e);
    }
}

exports.eliminarDirecciones = async(req,res) => {
    try {
        const user = await Usuario.findOne({ username: req.user.usernameU });
        const direccionEliminar = user.direcciones.id(req.params._id);
        console.log(direccionEliminar)
        if(direccionEliminar){
            direccionEliminar.remove();
            user.save();
            res.json(user)
        }else{
            res.json('producto no encontrado')
        }
    }catch(e){
        console.log(e);
        res.status(404).json(e);
    }
}