'use strict'
//variables
var fs = require('fs');
var path = require('path');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt')

var Artist = require('../models/artist');

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


	})


}

module.exports = {
	getArtist,
	saveArtist
};