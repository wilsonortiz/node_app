'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';


exports.ensureAuth = function(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).send({
			message: 'La petición no tiene la cabecera de autentificación.'
		});
	}

	var token = req.headers.authorization.replace(/['" + ]+/g, '');

	try {
		var payLoad = jwt.decode(token, secret);

		if (payLoad.exp <= moment.unix()) {
			return res.status(401).send({
				message: 'El Token ha expirado.'
			});
		}

	} catch (ex) {
		//console.log(ex);
		return res.status(404).send({
			message: 'Token no valido'
		});
	}

	req.user = payLoad;
	next();
};