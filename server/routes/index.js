const express = require('express');
//cargar todas las rutas

const app = express();

app.use(require('./usuario'));
app.use(require('./login'));



module.exports = app;