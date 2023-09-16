const Express = require('express');

// Middlewares:
const rootPath = require('../middleware/root_path.middleware');
const errors = require('../middleware/error_handler.middleware');

const userRoutes = require('./user');
const direccionRoutes = require('./direccion');
const productsRoutes = require('./products-route');
const uploadRoutes = require('./upload-route');

const app = Express();

// Rutas
app.use('/users', userRoutes);
app.use('/productos', productsRoutes);
app.use('/direccion', direccionRoutes);
app.use('/upload', uploadRoutes);

// use=
app.use('/ping', (req, res) => {
  res.json({
    response: 'pong!',
  });
});

app.use('/user', userRoutes);
app.use('/', productsRoutes);
app.use('/', rootPath.handler);
app.use(rootPath.setHeaders);
app.use(errors.handler);

module.exports = app;
