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

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums
};
