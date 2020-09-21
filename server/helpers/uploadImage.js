const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const borrarArchivo = (nombreImagen, tipo) => {
	let pathUrl = path.resolve(
		__dirname,
		`../../uploads/${tipo}/${nombreImagen}`
	);

	//borra una imagen
	if (fs.existsSync(pathUrl)) {
		fs.unlinkSync(pathUrl);
	}
};

const imagenProducto = (id, res, nombreArchivo) => {
	Producto.findById(id, (err, productoDB) => {
		if (err) {
			borrarArchivo(nombreArchivo, 'productos');
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!productoDB) {
			borrarArchivo(nombreArchivo, 'productos');
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		borrarArchivo(productoDB.img, 'productos');

		productoDB.img = nombreArchivo;

		productoDB.save((err, productoSave) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				producto: productoSave,
				img: nombreArchivo,
			});
		});
	});
};

const imagenUsuario = (id, res, nombreArchivo) => {
	Usuario.findById(id, (err, usuarioDB) => {
		if (err) {
			borrarArchivo(nombreArchivo, 'usuarios');
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!usuarioDB) {
			borrarArchivo(nombreArchivo, 'usuarios');
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		//se asigna el path del archivo anterior unico para id
		borrarArchivo(usuarioDB.img, 'usuarios');

		usuarioDB.img = nombreArchivo;

		usuarioDB.save((err, usuarioSave) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				usuario: usuarioSave,
				img: nombreArchivo,
			});
		});
	});
};

module.exports = {
	imagenUsuario,
	imagenProducto,
	borrarArchivo,
};
