'use strict'
// Modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// Modelos
var User = require('../models/user');

// Servicios
var jwt = require('../services/jwt');

// Acciones

// Metodo de pruebas
function pruebas(req, res) {

  res.status(200).send({
    message: 'Probando el controlador de usuarios',
    user: req.user
  });

}

// Metodo de login
function login(req, res) {
  var params = req.body;

  console.log(params);

  var email = params.email;
  var password = params.password;
  var gettoken = params.gettoken;

  console.log(params.gettoken);

  User.findOne({email: email.toLowerCase()}, (err, user) => {
    if(err) {
      return res.status(500).send + ({message: 'Error al comprobar el usuario'});
    } else {
      if(user) {

        bcrypt.compare(password, user.password, (err, check) => {
          if(check) {

            // Comprobar y generar token
            if(params.gettoken) {
              console.log("AQUI: " + params.gettoken);
              // devolver token
              res.status(200).send({
                jwtToken: jwt.createToken(user)
              });
            } else {
              return res.status(200).send({user});
            }

          } else {
            return res.status(404).send({
                message: 'El usuario no ha podido loguearse correctamente WS'
            });
          }
        });


      } else {
        return res.status(404).send({
            message: 'El usuario no ha podido loguearse'
        });
      }
    }
  });

}

// Metodo para registro de usuarios
function saveUser(req, res) {
  // Crear objeto
  var user = new User();
  // Recoger parametros
  var params = req.body;

  if(params.password && params.name && params.surname && params.email) {

    // Asignamos valores
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
      if(err) {
        return res.status(500).send + ({message: 'Error al comprobar el usuario'});
      } else {
        if(!issetUser) {
          // Encriptar password
          bcrypt.hash(params.password, null, null, function(err, hash) {

            // Asigna password encriptado
            user.password = hash;

            // Guardar usuario
            user.save((err, userStore) => {
              if(err) {
                return res.status(500).send + ({message: 'Error al guardar el usuario'});
              } else {
                if(!userStore) {
                  return res.status(404).send({message: 'No se ha guardado el usuario'});
                } else {
                  user.speak();
                  return res.status(200).send({user: userStore});
                }
              }
            });

          });
        } else {
          return res.status(404).send({message: 'El usuario ya existe'});
        }
      }
    });


  } else {
    console.log("Datos de entrada incorrectos");
    return res.status(200).send({message: 'Datos de entrada incorrectos'});
  }

}

function updateUser(req, res) {

  console.log("======================");
  console.log(req);
  console.log("======================");


  var userId = req.params.id;
  var update = req.body;

  delete update.password;

  if(userId != req.user.sub) {
    return res.status(500).send({
      message: 'No tienes permisos para actualizar el usuario'
    });
  }

  User.findByIdAndUpdate(userId, update, { new: true}, (err, userUpdated) => {
    if(err) {
      return res.status(500).send({
        message: 'Error al actualizar el usuario'
      });
    } else {
      if(!userUpdated) {
        res.status(404).send({
          message: 'No se ha podida actualizar el usuario'
        });
      } else {
        res.status(200).send({
          user: userUpdated
        });
      }
    }
  });

}

function uploadImage(req, res) {

  var userId = req.params.id;
  var file_name = 'No subido';

  if(req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

      if(userId != req.user.sub) {
        return res.status(500).send({
          message: 'No tienes permisos para actualizar el usuario'
        });
      }

      User.findByIdAndUpdate(userId, { image: file_name }, { new: true}, (err, userUpdated) => {
        if(err) {
          return res.status(500).send({
            message: 'Error al actualizar el usuario'
          });
        } else {
          if(!userUpdated) {
            res.status(404).send({
              message: 'No se ha podida actualizar el usuario'
            });
          } else {
            res.status(200).send({
              user: userUpdated,
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
  var path_file = './uploads/users/' + imageFile;

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

function getKeepers(req, res) {

  User.find({ role: 'ROLE_ADMIN' }).exec((err, users) => {
    if(err) {
      res.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if(!users) {
        res.status(404).send({
          message: 'No hay cuidadores'
        });
      } else {
        res.status(200).send({
          users
        });
      }
    }
  });

}

module.exports = {
  pruebas,
  saveUser,
  login,
  updateUser,
  uploadImage,
  getImageFile,
  getKeepers
}
