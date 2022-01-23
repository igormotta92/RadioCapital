//Por algum monito no alias não funcionou aqui!!! 18.05.20

//const dotenv = require('dotenv');
//dotenv.config();
//require('dotenv').config();

const path = require('path');

require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../',
    `.env.${process.env.NODE_ENV}.local`,
  ),
});

//Faz com q o console.log() mostra todos os objetos
//require("util").inspect.defaultOptions.depth = null;

const app = require('./app');

app.listen(process.env.PORT || '3333');
