const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/auth');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
	let tipo = req.params.tipo;
	let img = req.params.img;

	let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

	if (fs.existsSync(pathUrl)) {
		res.sendFile(pathUrl);
	} else {
		let noImgpath = path.resolve(__dirname, '../assets/no-image.jpg');
		res.sendFile(noImgpath);
	}
});

module.exports = app;
