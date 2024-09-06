const config = {
    development: {
        database: ':memory:', // Base de datos en memoria para pruebas
        port: 3000
    },
    test: {
        database: ':memory:', // Base de datos en memoria para pruebas
        port: 3001
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];