"use strict";
//variables
var fs = require("fs");
var path = require("path");
var moongosePaginate = require("mongoose-pagination");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

var Artist = require("../models/artist");

// funcion que obtiene el artista con su ID
function getArtist(req, res) {
	var artistID = req.params.id;

	Artist.findById(artistID, (err, artist) => {
		if (err) {
			res.status(500).send({message: "Error en la petición"});
		} else if (!artist) {
			res.status(404).send({message: "No se ha encontrado el artista"});
		} else {
			res.status(200).send({artist});
		}
	});
}

function getArtists(req, res) {
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}
	var itemsPerPage = 3;

	Artist.find().sort("name").paginate(page, itemsPerPage, function(err, artist, total) {
		if (err) {
			res.status(500).send({message: "Error en la petición."});
		} else if (!artist) {
			res.status(404).send({message: "No hay artistas"});
		} else {
			return res.status(200).send({total_items: total, artist: artist});
		}
	});
}

function saveArtist(req, res) {
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	(artist.description = params.description),
	(artist.image = "null");

	artist.save((err, artistStored) => {
		if (err) {
			res.status(500).send({message: "Error al guardar el artista"});
		} else if (!artistStored) {
			res.status(404).send({message: "El artista no ha sido guardado"});
		} else {
			res.status(200).send({artist: artistStored});
		}
	});
}

function updateArtist(req, res) {
	var artistID = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistID, update, (err, artistUpdate) => {
		if (err) {
			res.status(500).send({message: "Error al actualizar el artista."});
		} else if (!artistUpdate) {
			res.status(404).send({message: "No se ha podido actualizar el artista."});
		} else {
			res.status(200).send({artista: artistUpdate});
		}
	});
}

function deleteArtist(req, res) {
	var artistID = req.params.id;

	Artist.findByIdAndRemove(artistID, (err, artist) => {
		if (err) {
			res.status(500).send({message: "Internal server error"});
		}
		if (!artist) {
			res.status(404).send({message: "Artist not found"});
		} else {
			res.status(200).send({message: "Artist removed", artist: artist});
		}
	});
}

function uploadImage(req, res) {
	var artistID = req.params.id;
	var file_name = 'No subido...'

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

			Artist.findByIdAndUpdate(artistID, {
				image: file_name
			}, (err, artistUpdated) => {

				if (err) {
					res.status(500).send({message: 'Error al actualizar al artista.'});

				} else if (!artistUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar al artista.'});

				} else {
					res.status(200).send({user: artistUpdated});
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
	var path_file = './uploads/artist/' + imageFile;

	fs.exists(path_file, function(exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	getArtist,
	getArtists,
	saveArtist,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};
