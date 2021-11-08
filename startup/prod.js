const helmet = require('helmet');
const compression = require('compression');

// Se disponibiliza el módulo para preparar la aplicación para ser desplegada en PROD
module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
}