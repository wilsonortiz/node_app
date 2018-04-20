"use strict";
//variables
var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

var Artist = require("../models/artist");
var Album = require("../models/album");
var Song = require("../models/song");

// funcion que obtiene el artista con su ID
function getAlbum(req, res) {
	var albumID = req.params.id;

	Album.findById(albumID).populate({path: 'artist'}).exec((err, albumStored) => {
		if (err) {
			res.status(500).send({message: "Error en la petición"});
		} else if (!albumStored) {
			res.status(404).send({message: "No se ha encontrado el album"});
		} else {
			res.status(200).send({albumStored});
		}
	});
}

function getAlbums(req, res) {
	var artistID = req.params.artist;

	if (!artistID) {
		// obteger los album en bd
		var find = Album.find({}).sort('title');
	} else {
		//obtener los album de un artista en conqueto
		var find = Album.find({artist: artistID}).sort('year');
	}

	find.populate({path: 'artist'}).exec((err, albums) => {
		if (err) {
			res.status(500).send({message: "Error en la petición"});

		} else if (!albums) {
			res.status(400).send({message: "No existen album"});

		} else {
			res.status(200).send({albums});
		}
	});
}

function updateAlbum(req, res) {

	var albumID = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumID, update, (err, albumUpdate) => {
		if (err) {
			res.status(500).send({message: "Error en la petición"});

		} else if (!albumUpdate) {
			res.status(404).send({message: "Album not found"});

		} else {
			res.status(200).send({albumUpdate});
		}
	});

}

function saveAlbum(req, res) {
	var album = new Album()

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if (err) {
			res.status(500).send({message: "Internal server error"});

		} else if (!albumStored) {
			res.status(404).send({message: "Album not found"});

		} else {
			res.status(200).send({album: albumStored});
		}
	});
}

function deleteAlbum(req, res) {
	var albumID = req.params.id;

	Album.findByIdAndRemove(albumID, (err, album) => {
		if (err) {
			res.status(500).send({message: "Internal server error"});
		}
		if (!album) {
			res.status(404).send({message: "Album not found"});
		} else {
			res.status(200).send({message: "Album removed", album: album});
		}
	});
}

function uploadImage(req, res) {
	var albumID = req.params.id;
	var file_name = 'No subido...'

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

			Album.findByIdAndUpdate(albumID, {
				image: file_name
			}, (err, albumUpdated) => {

				if (err) {
					res.status(500).send({message: 'Error al actualizar al album.'});

				} else if (!albumUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar al album.'});

				} else {
					res.status(200).send({album: albumUpdated});
				}
			});

		} else {
			res.status(200).send({message: 'Extensión del archivo no valida.'});
		}

		console.log(ext_split);

	} else {
		res.status(200).send({message: 'No ha subido ninguna imagen.'});
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/album/' + imageFile;

	fs.exists(path_file, function(exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
};
