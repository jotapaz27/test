
const express = require('express');
const routerApi = require('./routes')
const config = require('./config')

const app = express();
const port = config.port;

routerApi(app)
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

module.exports = app;