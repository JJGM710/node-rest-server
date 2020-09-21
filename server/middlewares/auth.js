const jwt = require('jsonwebtoken');

//*====================
//*Verificar Token
//*====================

let verificaToken = (req, res, next) => {
	//lectura de headers
	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err,
			});
		}

		req.usuario = decoded.usuario;
		next();
	});
};

//*====================
//*Verificar Token
//*====================

let verificaAdminRole = (req, res, next) => {
	const { role } = req.usuario;

	if (role !== 'ADMIN_ROLE') {
		return res.status(401).json({
			ok: false,
			err: {
				message: 'No tienes los permisos para ejecutar esta accion',
				role: role,
			},
		});
	} else {
		console.log(role);
		next();
	}
};

//*====================
//*Verificar Token por Url IMG
//*====================

let verificaTokenImg = (req, res, next) => {
	//parametros opcionales
	let token = req.query.token;

	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'token no valido',
				},
			});
		}

		req.usuario = decoded.usuario;
		next();
	});
};

module.exports = {
	verificaToken,
	verificaAdminRole,
	verificaTokenImg,
};
