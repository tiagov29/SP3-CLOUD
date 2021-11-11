const config = require('./config.js');
const express = require ('express');
const morgan = require('morgan');
const app = express();
const PORT = config.module.PORT;
const usuarioRoutes = require('./routes/usuario.route.js');
const swaggerOptions = require('./utils/swaggerO.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const helmet = require('helmet');
require('./db.js');
const validationToken = require('./middlewares/validationToken.js');

app.use(morgan('dev'));
app.use(helmet());



const swaggerSpecs = swaggerJsDoc(swaggerOptions);

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(validationToken.exJwt, validationToken.validationToken);
app.use('/cuenta', require('./routes/cuenta.route.js'));
app.use('/mediosDePago', require('./routes/payment.route.js'));
app.use('/users', usuarioRoutes);
app.use('/productos', require('./routes/product.route.js'));
app.use('/pedidos', require('./routes/pedido.route.js'));


app.listen(PORT, () => {console.log('escuchando en el puerto ' + PORT)})

module.exports = app;

//ahora trabajando desde http
