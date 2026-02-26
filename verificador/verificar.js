'use strict'
var jwt = require('jwt-simple');
var claveSecreta = "Jossy_xavier_0902199400117V7"
exports.descodificar = function (req, res, next) {
   if (!req.headers.authorization) {
        return res.status(200).send({ mensaje: "No estas autorizado 👮‍♂️👮‍♀️🕵️‍♀️🕵️‍♂️..................." })
    } else {
        var version = req.headers.authorization.split(";")
       
        if (version[1]==="V7") {
           // var token = req.headers.authorization.replace(/['"]+/g, '')
           var token = version[0].replace(/['";]+/g, '')
            try {
                var payload = jwt.decode(token, claveSecreta);
     
            } catch (ex) {
                return res.status(200).send({ mensaje: "ACCESO DENEGADO IDENTIFIQUESE DE NUEVO" });
            }
            req.user = payload;
            next();
        } else {
            return res.status(200).send({ mensaje: "ACTUALIZA TU SISTEMA, HO NO PORDRAS UTILIZARLO.( CIERRE TODO Y BORRE EL HISTORIAL DE SU NAVEGADOR)" });
            
        }
       

    };
}

//pucha estoy trabajando dejen de tocar