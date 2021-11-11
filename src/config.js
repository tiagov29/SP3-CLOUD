const { config } = require('dotenv');

config();

exports.module = {
    MONGOOSE_URL: process.env.MONGOOSE_URL,
    PORT: process.env.PORT || 5000,
    ACCESO: process.env.ACCESO,
    PASSWORDA: process.env.PASSWORDA,
    PASSWORDB: process.env.PASSWORDB,
    PORT_REDIS: process.env.PORT_REDIS,
}