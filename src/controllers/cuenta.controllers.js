const  Usuario = require('../models/usuario.model.js');
const  UsuarioSchema = require('../Schemas/usuario.joi.js');
const loginSchema = require('../Schemas/login.joi.js');
const bcrypt = require('bcrypt');
const config = require('../config.js');
const jsonwebtoken = require('jsonwebtoken');
ACCESO = config.module.ACCESO;


exports.createAccount = async (req,res) => {
    try{
        const {usuario, email, username, password, telefono, direccion , isAdmin} = req.body;
        const result = await UsuarioSchema.validateAsync(req.body);
        if (result){
            const existeUsuario = await Usuario.findOne({ email });
            if(usuario &&  email && username && password && telefono && direccion) {
                if(existeUsuario){
                    res.status(404).json('el email ingresado ya esta siendo usado');
                }else{
                    const nuevoUsuario = new Usuario({
                    usuario,
                    email,
                    username,
                    password: bcrypt.hashSync(password, 3),
                    telefono,
                    direccion,
                    isAdmin});
                    nuevoUsuario.direcciones.push({ direccion })
                    nuevoUsuario.save();
                    res.status(201).json('cuenta creada');
                };
        } else {
            res.status(400).json(e.details[0].message)
        }
        }else{
        res.status(404).json('aun no has ingresado todos los datos');
            };
    }
    catch (e){
        res.status(400).json(e.details[0].message)
    }
}

exports.login = async (req,res) => {
   try{
       const { username, password } = await loginSchema.validateAsync(req.body);
        if( username && password) {
            const {usuario, email, password: passwordUser, esAdmin, username: usernameU, state, _id } = await Usuario.findOne({username});
            const resultado = bcrypt.compareSync(password, passwordUser);
            console.log(resultado);
        if(resultado && state == 'activo'){
            const token = jsonwebtoken.sign({
                usernameU,
                usuario,
                esAdmin,
                email,
            },ACCESO);
            res.json(`bienvenid@ ${username}, tu token es ${ token } y tu id es ${_id} `);
        }else{
            res.status(401).json('unauthorized');
        };
      } else {
          res.status(401).json('debes ingresar username y password para loguearte');
      };
   }catch (e){
       res.status(404).json(e);
   }
}