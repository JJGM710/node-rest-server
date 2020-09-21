const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
	descripcion: {
		type: String,
		unique: true,
		required: [true, 'La descripcion es necesaria'],
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
	},
});

//validator, plugin de moongose para el handling de errores
categoriaSchema.plugin(uniqueValidator, {
	message: '{PATH} debe de ser unico',
});

module.exports = mongoose.model('Categoria', categoriaSchema);
