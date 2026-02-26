'use strict'
var mysql = require('mysql2');
 
var connection = mysql.createPool({
   host     : '172.21.4.25',
    user     : 'jmelgar',
    password : 'Motocierra051051*',
    database : 'correspondencia_C_1'
})
module.exports = connection;
    /**  host     : 'localhost',
    user     : 'root',
    password : '@3mcVIH0N123',
    database : 'correspondencia_jefatura' */