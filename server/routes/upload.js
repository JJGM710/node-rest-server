const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const {
	imagenProducto,
	imagenUsuario,
	borrarArchivo,
} = require('../helpers/uploadImage');
app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {
	let tipo = req.params.tipo;
	let id = req.params.id;

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No se ha seleccionado ningun archivo',
			},
		});
	}

	//Valida tipo

	let tiposValidos = ['productos', 'usuarios'];
	if (tiposValidos.includes(tipo) == false) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'La tipos permitidas son ' + tiposValidos.join(', '),
			},
		});
	}

	// The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
	let archivo = req.files.archivo;
	//*extensiones permitidas
	let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
	let nombreArchivoCut = archivo.name.split('.');
	let extension = nombreArchivoCut[nombreArchivoCut.length - 1];

	//*Cambiar nombre del archivo

	let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

	if (extensionesValidas.includes(extension) == false) {
		return res.status(400).json({
			ok: false,
			err: {
				message:
					'La extensiones permitidas son' + extensionesValidas.join(', '),
			},
		});
	}

	//!otro metodo para validar extensiones de archivos

	// if (extensionesValidas.indexOf(extension) < 0) {
	// 	return res.status(400).json({
	// 		ok: false,
	// 		err: {
	// 			message:
	// 				'La extensiones permitidas son' + extensionesValidas.join(', '),
	// 		},
	// 	});
	// }

	// Use the mv() method to place the file somewhere on your server
	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
		if (err)
			return res.status(500).json({
				ok: false,
				err,
			});

		//*cargada en la carpeta
		if (tipo === 'usuarios') {
			imagenUsuario(id, res, nombreArchivo);
		}

		if (tipo === 'productos') {
			imagenProducto(id, res, nombreArchivo);
		}
	});
});

module.exports = app;