'use strict'
var jwt = require('jwt-simple');
var claveSecreta="Jossy_xavier_0902199400117V7"

exports.sacarToken = function(user){
   console.log("Tokens")
   console.log(user)
     var  payload ={
        nombres:user[0].nombre,
        correo:user[0].correo,
        usuario:user[0].usuario
     }
  return jwt.encode(payload,claveSecreta);
}