const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdminRole } = require('../middlewares/auth');

let app = express();

let Categoria = require('../models/categoria');
//*mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
	Categoria.find({})
		.sort('descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, categoria) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				categoria,
			});
		});
});

//*mostrar un categoria por id

app.get('/categoria/:id', verificaToken, (req, res) => {
	id = req.params.id;

	Categoria.findById(id, (err, categoria) => {
		if (!categoria) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'No hay categorias con ese ID',
				},
			});
		}

		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}
		res.json({
			ok: true,
			categoria,
		});
	});
});

//*crear categoria
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id,
	});

	categoria.save((err, categoria) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoria) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			categoria,
		});
	});

	//regresa la nueva categoria
	//req.usuario._id
});

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
	let id = req.params.id;

	let body = _.pick(req.body, ['descripcion']);

	Categoria.findByIdAndUpdate(
		id,
		body,
		{ new: true, runValidators: true, context: 'query' },
		(err, categoria) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			res.json({
				ok: true,
				categoria,
			});
		}
	);
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
	id = req.params.id;

	Categoria.findByIdAndDelete(id, (err, categoria) => {
		if (!categoria) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'No hay categorias con ese ID',
				},
			});
		}
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			info: {
				message: 'Categoria eliminada',
				categoria,
			},
		});
	});
	//solo la puede borrar un admin
});

module.exports = app;
