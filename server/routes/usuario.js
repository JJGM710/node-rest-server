const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');
// se exporta la clase Usuario
const Usuario = require('../models/usuario');
const app = express();
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

app.get('/usuarios', [verificaToken, verificaAdminRole], function (req, res) {
	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
	limite = Number(limite);

	Usuario.find({ estado: true }, 'nombre email role estado google img')
		.skip(desde)
		.limit(limite)
		.exec((err, usuarios) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			Usuario.countDocuments({ estado: true }, (err, conteo) => {
				res.json({
					ok: true,
					usuarios,
					conteo,
					by: req.usuario,
				});
			});
		});
});

app.post('/usuarios', [verificaToken, verificaAdminRole], function (req, res) {
	//body sale del enconded para obtener los datos que se envian en el form
	let body = req.body;

	//*se crea un nuevo objeto de tip Usuario
	//*el cual es el modelo que ya esta defino en el model
	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role,
	});

	usuario.save((err, usuarioDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			usuario: usuarioDB,
		});
	});
});

app.put('/usuarios/:id', [verificaToken, verificaAdminRole], function (
	req,
	res
) {
	let id = req.params.id;

	//!solo se reconoce comoparametros del body a los campos puestos
	let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

	Usuario.findByIdAndUpdate(
		id,
		body,
		{ new: true, runValidators: true, context: 'query' },
		(err, usuarioDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}
			res.json({ ok: true, usuario: usuarioDB });
		}
	);
});

app.delete('/usuarios/:id', [verificaToken, verificaAdminRole], function (
	req,
	res
) {
	let id = req.params.id;

	Usuario.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true },
		(err, usuario) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({ ok: true, usuario });
		}
	);

	// Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
	// 	if (err) {
	// 		return res.status(400).json({
	// 			ok: false,
	// 			err,
	// 		});
	// 	}

	// 	if (!usuarioBorrado) {
	// 		return res.status(400).json({
	// 			ok: false,
	// 			err: {
	// 				message: 'Usuario no encontrado',
	// 			},
	// 		});
	// 	}

	// 	res.json({ ok: true, usuario: usuarioBorrado });
	// });
});

module.exports = app;
