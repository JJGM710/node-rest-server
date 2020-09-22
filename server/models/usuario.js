const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol valido',
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario'],
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'El correo es necesario'],
	},
	password: {
		type: String,
		required: [true, 'La contrasena es requerida'],
	},
	img: {
		publicId: String,
		url: String,
	},
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: rolesValidos,
	},
	estado: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
});

usuarioSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
};

//validator, plugin de moongose para el handling de errores
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

// se exmporta el modulo, como una Clase paraa poder luego crear un objeto de el y obtener los metodos que
// ofrece Mongoose
module.exports = mongoose.model('Usuario', usuarioSchema);
