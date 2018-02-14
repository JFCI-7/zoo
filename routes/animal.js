'use strict'

var express = require('express');
var animalController = require('../controllers/animal');
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals' });

var api = express.Router();

api.get('/pruebas-animales', md_auth.ensureAuth, animalController.pruebas);
api.post('/animal', [md_auth.ensureAuth, md_admin.isAdmin], animalController.saveAnimal);
api.get('/animals', animalController.getAnimals);
api.get('/animal/:id', animalController.getAnimal);
api.put('/animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.updateAnimal);
api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload],animalController.uploadImage);
api.get('/get-image-animal/:imageFile', animalController.getImageFile);
api.delete('/animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], animalController.deteleAnimal);

module.exports = api;
