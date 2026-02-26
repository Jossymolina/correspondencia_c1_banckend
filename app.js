//CREANDO LOS CONTROLADORES DE RUTAS Y CONFIGURACION DE CABECERAS
'use strict'
var express = require ('express');
var bodyParser = require('body-parser');
var app = express();
var timeout = require('connect-timeout')
//Ingrementar parametros
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const apiTimeout =10000;
app.use((req, res, next) => {
   	  req.setTimeout(1200000,() => {
        let err = new Error('Request Timeout');
        err.status = 408;
		console.log("dentro swl time")
        next(err);
    });
   
    next();
	console.log("Tiepo de espera")
});


//
var rutas= require("./rutas/rutas");
 

app.use(timeout('1800s'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(req,res,next){

	res.header("Access-Control-Allow-Origin", "*");
 

	
	res.header("Access-Control-Allow-Headers","Authorization, X-API-KEY, Origin, X-Resquested-With, Content-Type, Accept, Access-Allow-Request-Method");
	res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE,OPTIONS");
	res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
	next();
})

app.use(rutas)
 



module.exports = app;