'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated')

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'})

api.post('/register', md_auth.ensureAuth, UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/updateUser/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image/:id', [
	md_auth.ensureAuth, md_upload
], UserController.uploadImage);
api.get('/get-image-artist/:imageFile', UserController.getImageFile);

module.exports = api;
