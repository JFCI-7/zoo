
'use strict'

// Crear servidor Nodejs y Express
var express = require('express');
var bodyParser = require('body-parser');

// Confuguracion para prod
var path = require('path');

var app = express();

// Cargar rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');

// Middlewares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// rutas base body-parser
app.use('/', express.static('client', { redirect: false }))
app.use('/api', user_routes);
app.use('/api', animal_routes);

// Si no colocamos 'api' carga esta ruta static
//app.use(express.static(path.join(__dirname, 'client')));

app.get('*', function(req, res, next) {
	res.sendFile(path.resolve('client/index.html'));
});



/*
app.get('/probandoGet', (req, res) => {
  res.status(200).send({message: 'Este metodo GET es el de probando...'});
});

app.post('/probandoPost', (req, res) => {
  res.status(200).send({message: 'Este metodo POST es el de probando...'});
});
*/


module.exports = app;
