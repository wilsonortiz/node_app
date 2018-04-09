'use strict'
//variables
var fs = require('fs');
var path = require('path');
var moongosePaginate = require('mongoose-pagination');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// funcion que obtiene el artista con su ID
function getArtist(req, res) {
	var artistID = req.params.id;

	Artist.findById(artistID, (err, artist) => {
		if (err) {
			res.status(500).send({
				message: 'Error en la petición'
			});

		} else if (!artist) {
			res.status(404).send({
				message: 'No se ha encontrado el artista'
			});

		} else {
			res.status(200).send({
				artist
			});
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

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artist, total) {
		if (err) {
			res.status(500).send({
				message: 'Error en la petición.'
			});

		} else if (!artist) {
			res.status(404).send({
				message: 'No hay artistas'
			});

		} else {
			return res.status(200).send({
				total_items: total,
				artist: artist
			});
		}
	});
}

function saveArtist(req, res) {
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description,
		artist.image = 'null';

	artist.save((err, artistStored) => {
		if (err) {
			res.status(500).send({
				message: 'Error al guardar el artista'
			});

		} else if (!artistStored) {
			res.status(404).send({
				message: 'El artista no ha sido guardado'
			});

		} else {
			res.status(200).send({
				artist: artistStored
			});
		}
	});
}

function updateArtist(req, res) {
	var artistID = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistID, update, (err, artistUpdate) => {
		if (err) {
			res.status(500).send({
				message: 'Error al actualizar el artista.'
			});

		} else if (!artistUpdate) {
			res.status(404).send({
				message: 'No se ha podido actualizar el artista.'
			});

		} else {
			res.status(200).send({
				artista: artistUpdate
			});
		}
	});
}

function deleteArtist(req, res) {
	var artistID = req.params.id;

	Artist.findByIdAndRemove(artistID, (err, artistRemove) => {
		if (err) {
			res.status(500).send({
				message: 'Error al eliminar el artista.'
			});

		} else if (!artistRemove) {
			res.status(404).send({
				message: 'El artista no ha sido eliminado.'
			});

		} else {
			Album.find({
				artist: artistRemove._id
			}).remove((err, albumRemove) => {
				if (err) {
					res.status(500).send({
						message: 'Error al eliminar el album.'
					});

				} else if (!albumRemove) {
					res.status(404).send({
						message: 'El Album no ha sido eliminado.'
					});

				} else {

					Song.find({
						album: albumRemove._id
					}).remove((err, songRemoved) => {
						if (err) {
							res.status(500).send({
								message: 'Error al eliminar la canción'
							});

						} else if (!songRemoved) {
							res.status(404).send({
								message: 'La canción no ha sido eliminada.'
							});
						} else {
							res.status(200).send({
								artist: artistRemove
							});
						}
					});
				}
			});
		}
	});
}


module.exports = {
	getArtist,
	getArtists,
	saveArtist,
	updateArtist,
	deleteArtist
};