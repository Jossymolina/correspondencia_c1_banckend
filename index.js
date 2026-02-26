'use strict'
var app = require('./app');
var port = process.env.PORT || 3001;
  
/*

https.createServer({
    cert: fs.readFileSync('/etc/ssl/ffaa.mil.hn/cert5.pem'),
    key: fs.readFileSync('/etc/ssl/ffaa.mil.hn/privkey5.pem')
  },app).listen(port, function(){
     console.log('Servidor https correindo en el puerto 8443');
 });
*/


app.listen(port,function(){
    console.log('EL SERVIDOR ESTA CORRIENDO EN: http://localhost:'+port);
   
})
