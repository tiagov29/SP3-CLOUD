const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sprint project 3 - Protalento",
            version: "1.0.0",
            description: "Proyecto 3 para acamica DWBE en la nube",
            contact : {
                name : " Santiago Valencia Valencia",
                email : "santiagovalenciav29@gmail.com"
            }
        },
        servers: [
            {
		    url: "https://www.candeleo.ml/",
                description: "Servidor de prueba"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};

module.exports = swaggerOptions;
