const expressjwt = require('express-jwt');
const config = require('../config.js');
// const db = require('../db.js');
const Usuario = require('../models/usuario.model.js');
const clienteRedis = require('../redis.js');

ACCESO = config.module.ACCESO;

exports.exJwt = expressjwt({
    secret: ACCESO,
    algorithms: ['HS256']
}).unless({path:['/cuenta/crearCuenta','/cuenta/login']});

exports.validationToken = ((err, req, res, next) => {
    if ( err.name === 'UnauthorizedError') {
        res.status(401).json('Token invalido');
    } else {
        res.status(500).json('Internal server error')
    }
});

exports.AdministrationToken = (async(req, res, next) => {
    const adminRequest = await Usuario.findOne({ username: req.user.usernameU, isAdmin: true });
    if(adminRequest){
        next();
    } else {
        res.status(404).json(' no tienes los permisos para ejecutar esta accion')
    }
})

exports.cache = ((req,res,next) => {
    clienteRedis.get('Productos', (err, dato) => {
        if(err) throw err;
        if(dato){
            res.json(JSON.parse(dato));
        }else{
            next();
        }
    })
})