const express = require('express');
const { verificaToken } = require('../middlewares/auth');
const _ = require('underscore');

let app = express();

let Producto = require('../models/producto');
const { isEmpty } = require('underscore');

//* Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {
	//trae todos los productos
	// populate usuario categoria
	//paginado
	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
	limite = Number(limite);

	Producto.find({ disponible: true })
		.skip(desde)
		.limit(limite)
		.populate('categoria', 'descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, producto) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				producto,
			});
		});
});

//* Obtener un producto por ID
app.get('/productos/:id', (req, res) => {
	//trae todos los productos
	// populate usuario categoria
	//paginado
	id = req.params.id;

	Producto.findById(id)
		.populate('categoria', 'descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, producto) => {
			if (err) {
				if (isEmpty(err.reason)) {
					return res.status(400).json({
						ok: false,
						err: {
							message: 'No hay producto con esa ID',
						},
					});
				}
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			res.json({
				ok: true,
				producto,
			});
		});
});

//*buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
	let termino = req.params.termino;
	let regex = new RegExp(termino, 'i');

	Producto.find({ nombre: regex })
		.populate('categoria', 'nombre')
		.exec((err, producto) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				producto,
			});
		});
});

//* Crear un nuevo producto
app.post('/productos', verificaToken, (req, res) => {
	//grabar el usaurio
	//grabar la categoria

	let body = req.body;

	let producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		categoria: body.categoria,
		usuario: req.usuario._id,
	});

	producto.save((err, producto) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			producto,
		});
	});
});

//* Actualizar un nuevo producto
app.put('/productos/:id', verificaToken, (req, res) => {
	//grabar el usaurio
	//grabar la categoria
	let id = req.params.id;

	let body = _.pick(req.body, [
		'nombre',
		'precioUni',
		'descripcion',
		'categoria',
		'disponible',
	]);

	Producto.findByIdAndUpdate(
		id,
		body,
		{ new: true, runValidators: true, context: 'query' },
		(err, producto) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			res.json({
				ok: true,
				producto,
			});
		}
	);
});

//* Actualizar un nuevo producto
app.delete('/productos/:id', verificaToken, (req, res) => {
	//disponible pase a falso

	let id = req.params.id;

	Producto.findByIdAndUpdate(
		id,
		{ disponible: false },
		{ new: true },
		(err, producto) => {
			if (err) {
				if (isEmpty(err.reason)) {
					return res.status(400).json({
						ok: false,
						err: {
							message: 'No hay producto con esa ID',
						},
					});
				}
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({ ok: true, producto });
		}
	);
});

module.exports = app;
