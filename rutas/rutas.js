 
var express = require("express");
var Controlador =require("../controlador/controlador");
const multer  = require('multer')
var mediador= require("../verificador/verificar")
var api = express.Router();
  //Decimo 4 de oficiales y sub Oficiales
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Archivos/directorios')
    },
    filename: function (req, file, cb) {                                                                                        
       // const unidad= file.originalname.split("$").shift()
   
        const exte= file.originalname.split(".").pop();
        const nombre=`${Date.now() + "-" + Math.round(Math.random() * 1E9)}.${exte}`
           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+"."+exte
      cb(null,  uniqueSuffix)
    }
  });

  const upload = multer({ storage: storage })

api.get("/prueba",[mediador.descodificar] , Controlador.prueba)
api.post("/crearOrganizacion",[mediador.descodificar] , Controlador.crearOrganizacion)
api.post("/agregarEntidad",[mediador.descodificar] , Controlador.agregarEntidad)
api.post("/eliminarOrganizacion",[mediador.descodificar] , Controlador.eliminarOrganizacion)
api.post("/modificarOrganizacion",[mediador.descodificar] , Controlador.modificarOrganizacion)
api.post("/eliminarEntidad",[mediador.descodificar] , Controlador.eliminarEntidad)
api.post("/modificarEntidad",[mediador.descodificar] , Controlador.modificarEntidad)
api.get("/sacarOrganizacion",[mediador.descodificar] , Controlador.sacarOrganizacion)
api.get("/sacarEntidad",[mediador.descodificar] , Controlador.sacarEntidad)
api.get("/sacarTipoEntidad",[mediador.descodificar] , Controlador.sacarTipoEntidad)
api.post("/sacarPadresEntidad",[mediador.descodificar] , Controlador.sacarPadresEntidad)
api.post("/guadarEntidad",[mediador.descodificar] , Controlador.guadarEntidad)
api.post("/sacarEntidades_X_Organizacion",[mediador.descodificar] , Controlador.sacarEntidades_X_Organizacion)
api.post("/agregarFirmas",[mediador.descodificar] , Controlador.agregarFirmas)
api.post("/sacarFirmas",[mediador.descodificar] , Controlador.sacarFirmas)
api.post("/eliminarFirmas",[mediador.descodificar] , Controlador.eliminarFirmas)
api.post("/modificarFirmas",[mediador.descodificar] , Controlador.modificarFirmas)
api.get("/sacarorigen",[mediador.descodificar] , Controlador.sacarorigen)
api.get("/sacarClasificacion",[mediador.descodificar] , Controlador.sacarClasificacion)
api.get("/sacarTipoCorrespondencia",[mediador.descodificar] , Controlador.sacarTipoCorrespondencia)
api.get("/sacarNivelAtencion",[mediador.descodificar] , Controlador.sacarNivelAtencion)
api.post("/guardarTiketCorrespondencia",[mediador.descodificar,upload.array("myfile")], Controlador.guardarTiketCorrespondencia)
api.post("/guardarUsuarios",[mediador.descodificar], Controlador.guardarUsuarios)
api.get("/sacarTodoUsuario",[mediador.descodificar],  Controlador.sacarTodoUsuario)
api.post("/eliminarUsuario",[mediador.descodificar],  Controlador.eliminarUsuario)
api.post("/modificarUsuario",[mediador.descodificar],  Controlador.modificarUsuario)
api.post("/loguiarse",  Controlador.loguiarse)
api.post("/buscarUsuario",[mediador.descodificar],  Controlador.buscarUsuario)


api.post("/sacarCorrespondenciaPorUsuario",[mediador.descodificar],  Controlador.sacarCorrespondenciaPorUsuario)


api.get("/sacarArchivosPDF/:id",[mediador.descodificar] ,Controlador.sacarArchivosPDF)



api.post("/sacarArchivosCorrespondencia",[mediador.descodificar],  Controlador.sacarArchivosCorrespondencia)
api.post("/agregarComentarioDocumento",[mediador.descodificar],  Controlador.agregarComentarioDocumento)
api.post("/sacarcomentarioArchivo",[mediador.descodificar],  Controlador.sacarcomentarioArchivo)
api.post("/cargarMasArchivoCorrespondecia",[upload.array("myfile")], Controlador.cargarMasArchivoCorrespondecia)
api.post("/agregarDisposicion",[mediador.descodificar],  Controlador.agregarDisposicion)
api.post("/sacarDisposicion",[mediador.descodificar],  Controlador.sacarDisposicion)
api.post("/eliminarArchivoCorrespondencia",[mediador.descodificar],  Controlador.eliminarArchivoCorrespondencia)
api.post("/sacarUsuarioCompartidoCorrespondencia",[mediador.descodificar],  Controlador.sacarUsuarioCompartidoCorrespondencia)
api.post("/compartirMasUsuario",[mediador.descodificar],  Controlador.compartirMasUsuario)
api.post("/sacarCorrespondeciasCompartidasUsuario",[mediador.descodificar],  Controlador.sacarCorrespondeciasCompartidasUsuario)

api.post("/guardarOrigenes",[mediador.descodificar],  Controlador.guardarOrigenes)
api.post("/modificarOrigenes",[mediador.descodificar],  Controlador.modificarOrigenes)
api.post("/eliminarOrigenes",[mediador.descodificar],  Controlador.eliminarOrigenes)

api.post("/guardarClasificacion",[mediador.descodificar],  Controlador.guardarClasificacion)
api.post("/modificarClasificacion",[mediador.descodificar],  Controlador.modificarClasificacion)
api.post("/EliminarClasificacion",[mediador.descodificar],  Controlador.EliminarClasificacion)

api.post("/guardarPrioridad",[mediador.descodificar],  Controlador.guardarPrioridad)
api.post("/EliminarPrioridad",[mediador.descodificar],  Controlador.EliminarPrioridad)
api.post("/ModificarPrioridad",[mediador.descodificar],  Controlador.ModificarPrioridad)
 
api.post("/guardarTipo",[mediador.descodificar],  Controlador.guardarTipo)
api.post("/eliminarTipo",[mediador.descodificar],  Controlador.eliminarTipo)
api.post("/modificarTipo",[mediador.descodificar],  Controlador.modificarTipo)


api.post("/guardarEstado",[mediador.descodificar],  Controlador.guardarEstado)
api.get("/sacarestado",[mediador.descodificar],  Controlador.sacarestado)
api.post("/modificarEstado",[mediador.descodificar],  Controlador.modificarEstado)
api.post("/eliminarEstado",[mediador.descodificar],  Controlador.eliminarEstado)
api.post("/agregarDefaultEstado",[mediador.descodificar],  Controlador.agregarDefaultEstado)
api.post("/cambiarEstadoCorrespondencia",[mediador.descodificar],  Controlador.cambiarEstadoCorrespondencia)
api.post("/sacarEstadoCorrespondencias",[mediador.descodificar],  Controlador.sacarEstadoCorrespondencias)
api.post("/eliminarCorrespondencia",[mediador.descodificar],  Controlador.eliminarCorrespondencia)
api.post("/sacarPermisos",[mediador.descodificar],  Controlador.sacarPermisos)
api.post("/administarrPermisosUsuario",[mediador.descodificar],  Controlador.administarrPermisosUsuario)
api.post("/resetContrasena",[mediador.descodificar],  Controlador.resetContrasena)
api.post("/reseteracontrasenaUsuarioFinal",[mediador.descodificar],  Controlador.reseteracontrasenaUsuarioFinal)
api.post("/reporteVistaMonitoreo_mensual",[mediador.descodificar],  Controlador.reporteVistaMonitoreo_mensual)

//Expediente
api.get("/sacarFuerza",[mediador.descodificar],  Controlador.sacarFuerza)
api.post("/sacarCategoria",[mediador.descodificar],  Controlador.sacarCategoria)
api.post("/sacarSubCategoria",[mediador.descodificar],  Controlador.sacarSubCategoria)
api.post("/insertarExpedienteTitular",[mediador.descodificar],  Controlador.insertarExpedienteTitular)
api.post("/sacarPersonasExpediente",[mediador.descodificar],  Controlador.sacarPersonasExpediente)
api.post("/guadarExpe_familiar",[mediador.descodificar],  Controlador.guadarExpe_familiar)
api.get("/sacarParentezco",[mediador.descodificar],  Controlador.sacarParentezco)
api.post("/buscarExpedienteTodos",[mediador.descodificar],  Controlador.buscarExpedienteTodos)
api.post("/sacarmovimientoPorEntidad",[mediador.descodificar],  Controlador.sacarmovimientoPorEntidad)
api.post("/sacarExpedientesPendientes",[mediador.descodificar],  Controlador.sacarExpedientesPendientes)
api.post("/sacarExpedientesRecibidos",[mediador.descodificar],  Controlador.sacarExpedientesRecibidos)
api.post("/aceptarRecibidosPendiente",[mediador.descodificar],  Controlador.aceptarRecibidosPendiente)
api.post("/enviarExpediente",[mediador.descodificar],  Controlador.enviarExpediente)
api.post("/agregarUnuevoExpedienteExistente",[mediador.descodificar],  Controlador.agregarUnuevoExpedienteExistente)
api.post("/buscarDondeEstaUnExpediente",[mediador.descodificar],  Controlador.buscarDondeEstaUnExpediente)
api.post("/modificarPersonaExpediente",[mediador.descodificar],  Controlador.modificarPersonaExpediente)
api.post("/sacarinformacionSiEsTitular",[mediador.descodificar],  Controlador.sacarinformacionSiEsTitular)
api.post("/ModificarDatosFamiliares",[mediador.descodificar],  Controlador.ModificarDatosFamiliares)
api.post("/aliminarVinculo",[mediador.descodificar],  Controlador.aliminarVinculo)
api.post("/sacarTipoVinculoPrFamiliar",[mediador.descodificar],  Controlador.sacarTipoVinculoPrFamiliar)
api.post("/sacarHistoricoMovimiento",[mediador.descodificar],  Controlador.sacarHistoricoMovimiento)
api.post("/sacarOtrosOrigenes",[mediador.descodificar],  Controlador.sacarOtrosOrigenes)
api.post("/modificarTexto",[mediador.descodificar],  Controlador.modificarTexto)
api.post("/sacarDisposicionesID",[mediador.descodificar],  Controlador.sacarDisposicionesID)
api.post("/guardarDisposicionModificada",[mediador.descodificar],  Controlador.guardarDisposicionModificada)
api.post("/obtenerAlertasCorrespondencia",[mediador.descodificar],  Controlador.obtenerAlertasCorrespondencia)






 







//api.post("/guardarht",[upload.array("myfile")] ,Controlador.guardarht)








    


module.exports=api;