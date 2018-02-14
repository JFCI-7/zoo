'use strict'
// Modulos
var fs = require('fs');
var path = require('path');

// Modelos
var User = require('../models/user');
var Animal = require('../models/animal');

// Servicios

// Acciones

// Metodo de pruebas
function pruebas(req, res) {

  res.status(200).send({
    message: 'Probando el controlador de animales',
    user: req.user
  });
}

function saveAnimal(req, res) {
  var animal = new Animal();

  var params = req.body;

  if(params.name) {
    animal.name = params.name;
    animal.description = params. description;
    animal.year = params.year;
    animal.image = null;
    animal.user = req.user.sub;

    animal.save((err, animalStore) => {
      if(err) {
        return res.status(500).send({
          message: 'Error en el servidor'
        });
      } else {
        if(!animalStore) {
          return res.status(404).send({
            message: 'No se ha gardado el animal'
          });
        } else {
          return res.status(200).send({
            animal: animalStore
          });
        }
      }

    });
  } else {
    return res.status(200).send({
      message: 'El nombre del animal es obligatorio'
    });
  }

}

function getAnimals(req, res) {

  Animal.find({}).populate({ path: 'user' }).exec((err, animals) => {
    if(err) {
      return res.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if(!animals) {
        return res.status(404).send({
          message: 'No hay animales'
        });
      } else {
        return res.status(200).send({
          animals
        });
      }
    }
  });

}

function getAnimal(req, res) {
  var animalId = req.params.id;

  Animal.findById(animalId).populate({ path: 'user' }).exec((err, animal) => {
    if(err) {
      return res.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if(!animal) {
        return res.status(404).send({
          message: 'El animal no existe'
        });
      } else {
        return res.status(200).send({
          animal
        });
      }
    }
  });
}

function updateAnimal(req, res) {
  var animalId = req.params.id;
  var update = req.body;

  console.log(update);

  Animal.findByIdAndUpdate(animalId, update, { new: true }, (err, animalUpdated) => {
    if(err) {
      return res.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if(!animalUpdated) {
        return res.status(404).send({
          message: 'No se ha actualizado el animal'
        });
      } else {
        console.log(animalUpdated);
        return res.status(200).send({
          animal: animalUpdated
        });
      }
    }
  });
}

function uploadImage(req, res) {

  var animalId = req.params.id;
  var file_name = 'No subido';

  if(req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

      /*
      if(animalId != req.user.sub) {
        return res.status(500).send({
          message: 'No tienes permisos para actualizar el usuario'
        });
      }*/

      Animal.findByIdAndUpdate(animalId, { image: file_name }, { new: true}, (err, animalUpdated) => {
        if(err) {
          return res.status(500).send({
            message: 'Error al actualizar el animal'
          });
        } else {
          if(!animalUpdated) {
            res.status(404).send({
              message: 'No se ha podida actualizar el animal'
            });
          } else {
            res.status(200).send({
              animal: animalUpdated,
              image: file_name
            });
          }
        }
      });

    } else {
      fs.unlink(file_path, (err) => {
        if(err) {
          res.status(200).send({
            message: 'La extención no es valida y fichero no borrado'
          });
        } else {
          res.status(200).send({
            message: 'La extención no es valida'
          });
        }
      });

    }

    /*
    res.status(200).send({
      file_path: file_path,
      file_split: file_split,
      file_name: file_name
    });*/


  } else {
    res.status(200).send({
      message: 'No se han subido archivos'
    });
  }


}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/animals/' + imageFile;

  console.log(path_file);

  fs.exists(path_file, function(exist) {
    if(exist) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(404).send({
        message: 'La imagen no existe'
      });
    }
  });

}

function deteleAnimal(req, res) {
  var animalId = req.params.id;

  Animal.findByIdAndRemove(animalId, (err, animalRemoved) => {
    if(err) {
      res.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if(!animalRemoved) {
        res.status(404).send({
          message: 'No se ha borrado el animal'
        });
      } else {
        res.status(200).send({
          animal: animalRemoved
        });
      }
    }
  });
}

module.exports = {
  pruebas,
  saveAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  uploadImage,
  getImageFile,
  deteleAnimal
};