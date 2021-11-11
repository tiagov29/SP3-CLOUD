const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');
const Usuarios = require('../models/usuario.model.js');
const bcrypt = require('bcrypt');
const config = require('../config.js');
const jsonWebToken = require('jsonwebtoken');
const PASSWORD = config.module.PASSWORDB

chai.should();
chai.use(chaiHttp);

describe('Creacion de cuenta', () => {
    describe('POST /cuenta/crearCuenta de forma exitosa', () => {
            it('debe devolver un 201 en status', (done) => {
                const usuario = {
                    usuario : 'test',
                    email: 'test@gmail.com',
                    username: 'test',
                    password: 'passwordTest123',
                    telefono: 321887498,
                    direccion: 'Avenida test',
                    };
                    chai.request(app)
                        .post('/cuenta/crearCuenta')
                        .send(usuario)
                        .end((err, response) => {
                            response.should.have.status(201);
                            response.should.be.an('object');
                            done();
                        });
                    });
                    after(async() => {
                        await Usuarios.deleteOne({ email : 'test@gmail.com'});
                    });

    });
});