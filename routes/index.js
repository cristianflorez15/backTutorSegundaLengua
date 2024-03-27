const express = require('express');
const router = express.Router();
const usuarioRouter = require('../routes/usuario.router') 

function routerApi(app){
  app.use('/api', router);
  router.use('/usuario', usuarioRouter);
}

module.exports = routerApi;
