
'use strict'

// Conexion a mongodb
var mongoose = require('mongoose');

// Cargar fichero app
var app = require('./app');
// Puerto que va a utilizar node server
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo', { useMongoClient: true })
        .then(() => {          
          console.log("Conexion establecida....");

          app.listen(port, () => {
            console.log(`Corriendo en el puerto ${port}`)
          });
        })
        .catch(err => console.log(err));
/*
mongoose.connect("mongodb://localhost:27017/zoo" , (err, res) => {
  if (err) {
    return console.log(`Error al conectar : ${err}`);
  } else {
    console.log("Conexion establecida");

    app.listen(port, () => {
      console.log(`Corriendo en el puerto ${port}`)
    });


  }
});
*/





// okok
