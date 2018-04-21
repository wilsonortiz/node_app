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

function deleteSong(req, res) {

	var sondID = req.params.id;

	Song.findByIdAndRemove(sondID, (err, songRemoved) => {
		if (err) {
			res.status(500).send({message: "Internal server error"});

		} else if (!songRemoved) {
			res.status(404).send({message: "Song not found"});

		} else {
			res.status(200).send({song: songRemoved});
		}

	});

}

function uploadFile(req, res) {
	var songID = req.params.id;
	var file_name = 'No subido...'

	if (req.files) {
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'mp3') {

			Song.findByIdAndUpdate(songID, {
				file: file_name
			}, (err, songUpdated) => {

				if (err) {
					res.status(500).send({message: 'Error al actualizar la canción.'});

				} else if (!songUpdated) {
					res.status(404).send({message: 'Not found.'});

				} else {
					res.status(200).send({song: songUpdated});
				}
			});

		} else {
			res.status(200).send({message: 'Extensión del archivo no valida.'});
		}

		console.log(ext_split);

	} else {
		res.status(200).send({message: 'No existe el fichero de audio.'});
	}
}

function getSongFile(req, res) {
	var songFile = req.params.songFile;
	var path_file = './uploads/songs/' + songFile;

	fs.exists(path_file, function(exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({message: 'No existe el fichero de audio.'});
		}
	});
}

module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}
