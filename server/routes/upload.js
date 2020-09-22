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
		// if (tipo === 'usuarios') {
		// 	imagenUsuario(id, res, nombreArchivo);
		// }

		// if (tipo === 'productos') {
		// 	imagenProducto(id, res, nombreArchivo);
		// }
	});

	// const borrarArchivo = (nombreImagen, tipo) => {
	// 	let pathUrl = path.resolve(
	// 		__dirname,
	// 		`../../uploads/${tipo}/${nombreImagen}`
	// 	);

	// 	//borra una imagen
	// 	if (fs.existsSync(pathUrl)) {
	// 		fs.unlinkSync(pathUrl);
	// 	}

	let pathUrl = path.resolve(
		__dirname,
		`../../uploads/${tipo}/${nombreArchivo}`
	);
	// SEND FILE TO CLOUDINARY
	const cloudinary = require('cloudinary').v2;
	cloudinary.config({
		cloud_name: 'hadesdev',
		api_key: '863213963382967',
		api_secret: 'yB22qLtqLepYwXm2O6x_0wjLkFM',
	});

	// const path = req.file.path
	const uniqueFilename = new Date().toISOString();

	const imagenUser = (id, image) => {
		Usuario.findById(id, (err, usuarioDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			//borra el archivo existente en Cloudinary

			if (usuarioDB?.img) {
				let public_id = usuarioDB.img.publicId;

				cloudinary.uploader.destroy(public_id, function (error, result) {
					console.log(result);
				});
			}

			usuarioDB.img.publicId = image.public_id;
			usuarioDB.img.url = image.url;

			usuarioDB.save((err, usuarioSave) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err,
					});
				}

				// console.log(usuarioSave);
			});
		});
	};

	cloudinary.uploader.upload(
		pathUrl,
		{ public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
		function (err, image) {
			if (err) return res.send(err);
			console.log('file uploaded to Cloudinary');
			fs.unlinkSync(pathUrl);
			// console.log(image);
			// return image details
			imagenUser(id, image);
			res.json(image);
		}
	);
});

module.exports = app;
