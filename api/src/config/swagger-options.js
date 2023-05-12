const options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'cookie',
                name: 'Cookie',
            }
        }
    },
    basedir: __dirname, //app absolute path
	apis: [ './api/controllers/*.js' ] //Path to the API handle folder
  };

  export default options;
