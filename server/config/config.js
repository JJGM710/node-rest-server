//==========================
//!VARIABLES DE ENTORNO
//==========================

//********PUERTO******************
process.env.PORT = process.env.PORT || 3000;

//********DESARROLLO/PRODUCCION******************

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
//!Vencimiento del token
//==========================
process.env.EXP_TOKEN = 60 * 60 * 24 * 30;

//!Google Client ID

process.env.CLIENT_ID =
	process.env.CLIENT_ID ||
	'626504869897-v5hgv4l1b8vpakfa4m0s7rgtagt2pgj3.apps.googleusercontent.com';

//==========================
//!SEED, AUTETINCACION SEMILLA
//==========================
process.env.SEED = process.env.SEED || 'secretdev';

//==========================
//!BASE DE DATOS
//==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
	urlDB = 'mongodb://localhost:27017/cafe';
	console.log('You are in dev mode!');
} else {
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//mongodb+srv://superu:superu@cluster1.jjc5c.mongodb.net/cafe?retryWrites=true&w=majority
