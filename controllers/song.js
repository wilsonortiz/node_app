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
function getSong(req, res) {
	var songID = req.params.id;

	Song.findById(songID).populate({path: 'album'}).exec((err, song) => {
		if (err) {
			res.status(500).send({message: "Error en la petición"});
		} else if (!song) {
			res.status(404).send({message: "No se ha encontrado la cancion"});
		} else {
			res.status(200).send({song});
		}
	});
}

function getSongs(req, res) {
	var albumID = req.params.album;

	if (!albumID) {
		var find = Song.find({}).sort('number');

	} else {
		var find = Song.find({album: albumID}).sort('number');
	}
	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}

	}).exec(function(err, song) {
		if (err) {
			res.status(500).send({message: "Error en la petición"});
		} else if (!song) {
			res.status(404).send({message: "No hay canciones"});
		} else {
			res.status(200).send({song});
		}
	});
}

function saveSong(req, res) {
	var song = new Song()

	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if (err) {
			res.status(500).send({message: "Internal server error"});

		} else if (!songStored) {
			res.status(404).send({message: "Album not found"});

		} else {
			res.status(200).send({song: songStored});
		}
	});
}

function updateSong(req, res) {
	var songID = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songID, update, (err, songUpdated) => {
		if (err) {
			res.status(500).send({message: "Internal server error"});

		} else if (!songUpdated) {
			res.status(404).send({message: "Song not found"});

		} else {
			res.status(200).send({song: songUpdated});
		}
	});

}

module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong
}
