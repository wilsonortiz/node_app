'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3500;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
	if (err) {
		//	throw err;
		console.log("Error en la configuración de la base de datos" + err);
	} else {
		console.log("La base de datos esta funcionando correctamente");

		app.listen(port, function() {
			console.log("Servidor API rest funcionando en http://localhost:" + port);
		});
	}
});