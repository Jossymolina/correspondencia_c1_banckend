function sacarOrigen() {
    return `SELECT * FROM correspondencia_C_1.origen  order by descripcion asc`
}
function sacarClasificaciones() {
    return `SELECT * FROM correspondencia_C_1.clasificacion order by descripcion asc`
}
function guardarArchivo(idht, idusuario, iddepartamento, nombre) {
    return `INSERT INTO correspondencia_C_1.documento (idht, idusuario, iddepartamento, nombre, fecha) 
                VALUES (${idht}, ${idusuario},${iddepartamento}, '${nombre}', now());`
}
function insertarHT(idorigen, idusuario, idclasificacion, idexpediente, observacion, idsecretario, idtipo_documento, iddepartamento) {
    return `call correspondencia_C_1.insertar_HT(${idorigen},${idusuario},${idclasificacion},'${idexpediente}','${observacion}',${idsecretario},${idtipo_documento},${iddepartamento} );`
}
function sacarDocumentos() {
    return `SELECT hoja_transmision.fecha_registro as fecha_registro, hoja_transmision.idht as hoja_transmision,clasificacion.idclasificacion as idclasificacion, 
     clasificacion.descripcion as clasificacion,expediente,origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
     departamento.iddepartamento, nombre as destino, hoja_transmision.observacion as observacion, destinos.observacion as disposicion, usuario as usuario,
     hoja_transmision.idht
     FROM correspondencia_C_1.destinos
     join correspondencia_C_1.hoja_transmision on destinos.idht=hoja_transmision.idht
     join correspondencia_C_1.origen on hoja_transmision.idorigen=origen.idorigen
     join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion=clasificacion.idclasificacion
     join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
     join correspondencia_C_1.departamento on destinos.iddepartamento=departamento.iddepartamento
     `
}
function sacardocumento_de_ht(idht) {
    return `SELECT idht as idht, fecha as fecha, departamento.iddepartamento as iddepartamento, 
    departamento.nombre as nombre_departamento, usuario.idusuario as idusuario, usuario.usuario as usuario,documento.nombre as dir FROM correspondencia_C_1.documento
    join correspondencia_C_1.usuario on documento.idusuario =usuario.idusuario
    join correspondencia_C_1.departamento on documento.iddepartamento=departamento.iddepartamento
    where idht=${idht}`
}
function loginUser(usuario, contrasena) {
    return `SELECT persona.identidad as identidad,usuario.idusuario, persona.nombre as nombre_persona,roles.idroles as idroles, descripcion as permisos, departamento.iddepartamento as iddepartamento, 
    departamento.nombre as nombre_departamento FROM correspondencia_C_1.usuario 
    join correspondencia_C_1.departamento on usuario.iddepartamento=departamento.iddepartamento
    join correspondencia_C_1.persona on usuario.identidad=persona.identidad
    join correspondencia_C_1.permisos on usuario.idusuario=permisos.idusuario
    join correspondencia_C_1.roles on permisos.idroles=roles.idroles
    where usuario='${usuario}' and contraseña='${contrasena}'`
}
function sacarDepartamentos() {
    return `SELECT * FROM correspondencia_C_1.departamento;`
}
function insertarDestinosHT(iddepartamento, idht, estado, observacion) {
    return `call correspondencia_C_1.insertar_destinos(${iddepartamento}, ${idht}, ${estado}, '${observacion}');`
}
function sacarDocumentosPorDestino(iddepartamento, idtipo_documento) {
    /**
     * Saca documentos unicamente del departamento que los creo
     */
    /*
        SELECT estado.descripcion as descripcion_estado,iddestino,hoja_transmision.fecha_registro as fecha_registro, hoja_transmision.idht as hoja_transmision,clasificacion.idclasificacion as idclasificacion, 
    clasificacion.descripcion as clasificacion,expediente,origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
    departamento.iddepartamento,color, departamento.nombre as destino, hoja_transmision.observacion as observacion, destinos.observacion as disposicion, usuario as usuario,
    hoja_transmision.idht,tipo_documento.nombre as tipo_nombre,tipo_documento.idtipo_documento as idtipo_documento,hoja_transmision.idht
    FROM correspondencia_C_1.destinos
    join correspondencia_C_1.hoja_transmision on destinos.idht=hoja_transmision.idht
    join correspondencia_C_1.origen on hoja_transmision.idorigen=origen.idorigen
    join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion=clasificacion.idclasificacion
    join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
    join correspondencia_C_1.departamento on destinos.iddepartamento=departamento.iddepartamento
      join correspondencia_C_1.estado on destinos.idestado=estado.idestado
      join correspondencia_C_1.tipo_documento on tipo_documento.idtipo_documento =  hoja_transmision.idtipo_documento
     where destinos.iddepartamento = ${iddepartamento}
    */
    if (idtipo_documento === 0) {
        return `  
        SELECT 
estado.descripcion as descripcion_estado,hoja_transmision.fecha_registro as fecha_registro, hoja_transmision.idht as hoja_transmision,
clasificacion.idclasificacion as idclasificacion, 
    clasificacion.descripcion as clasificacion,expediente,origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
    departamento.iddepartamento,color,color_, departamento.nombre as destino, hoja_transmision.observacion as observacion, destinos.observacion as disposicion, usuario as usuario,
    hoja_transmision.idht,tipo_documento.nombre as tipo_nombre,tipo_documento.idtipo_documento as idtipo_documento,hoja_transmision.idht
 FROM correspondencia_C_1.hoja_transmision 
JOIN correspondencia_C_1.destinos on destinos.idht =  hoja_transmision.idht
join correspondencia_C_1.estado on estado.idestado = destinos.idestado
   join correspondencia_C_1.origen on hoja_transmision.idorigen=origen.idorigen
    join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion=clasificacion.idclasificacion
    join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
    join correspondencia_C_1.departamento on hoja_transmision.iddepartamento=departamento.iddepartamento
    join correspondencia_C_1.tipo_documento on tipo_documento.idtipo_documento =  hoja_transmision.idtipo_documento
where  hoja_transmision.iddepartamento = destinos.iddepartamento and hoja_transmision.iddepartamento=${iddepartamento}
order by fecha_recibido desc limit 3000
 
   `
    } else {
        return `  
        SELECT 
        estado.descripcion as descripcion_estado,hoja_transmision.fecha_registro as fecha_registro, hoja_transmision.idht as hoja_transmision,clasificacion.idclasificacion as idclasificacion, 
            clasificacion.descripcion as clasificacion,expediente,origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
            departamento.iddepartamento,color, departamento.nombre as destino, hoja_transmision.observacion as observacion, destinos.observacion as disposicion, usuario as usuario,
            hoja_transmision.idht,tipo_documento.nombre as tipo_nombre,tipo_documento.idtipo_documento as idtipo_documento,hoja_transmision.idht
         FROM correspondencia_C_1.hoja_transmision 
        JOIN correspondencia_C_1.destinos on destinos.idht =  hoja_transmision.idht
        join correspondencia_C_1.estado on estado.idestado = destinos.idestado
           join correspondencia_C_1.origen on hoja_transmision.idorigen=origen.idorigen
            join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion=clasificacion.idclasificacion
            join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
            join correspondencia_C_1.departamento on hoja_transmision.iddepartamento=departamento.iddepartamento
            join correspondencia_C_1.tipo_documento on tipo_documento.idtipo_documento =  hoja_transmision.idtipo_documento
        where  hoja_transmision.iddepartamento = destinos.iddepartamento and hoja_transmision.iddepartamento=${iddepartamento} and  tipo_documento.idtipo_documento  = ${idtipo_documento}
        order by fecha_recibido desc limit 3000
        `
    }

}
function sacarEstados() {
    return `SELECT * FROM correspondencia_C_1.estado order by descripcion asc`
}
function actualizarestadoDestino(idestado, iddepartamento,idht) {
    return `
    UPDATE correspondencia_C_1.destinos SET idestado = '${idestado}'  WHERE (iddepartamento = ${iddepartamento}) and (idht = ${idht});`

}
function agregarComentario(idusuario,iddepartamento,idht, comentarios) {
    return `
        INSERT INTO correspondencia_C_1.comentarios_docto (idusuario, iddepartamento, idht, comentarios, fecha)
        VALUES (${idusuario}, ${iddepartamento}, ${idht}, '${comentarios}', now());
 
    `
}
function sacarComentario(idht,iddepartamento) {
    return ` 
    SELECT usuario.idusuario,comentarios,fecha,usuario,persona.identidad,persona.nombre as persona_nombre,departamento.iddepartamento,departamento.nombre as departamento_nombre
    FROM correspondencia_C_1.comentarios_docto
       join correspondencia_C_1.usuario on usuario.idusuario = comentarios_docto.idusuario
       join correspondencia_C_1.persona on persona.identidad = usuario.identidad
       join correspondencia_C_1.departamento on departamento.iddepartamento = usuario.iddepartamento
       where  comentarios_docto.idht = ${idht} 
     `
}
function sacarSecretarioEstado() {
    return `SELECT * FROM correspondencia_C_1.secretario_estado
    join correspondencia_C_1.persona on persona.identidad =  secretario_estado.identidad
    join correspondencia_C_1.cargos on cargos.idcargos = secretario_estado.idcargos`
}
function sacarEstadosdeht(idht) {
    return `SELECT * FROM correspondencia_C_1.destinos 
    join correspondencia_C_1.estado on estado.idestado = destinos.idestado
    join correspondencia_C_1.departamento on  departamento.iddepartamento = destinos.iddepartamento
    where idht=${idht}`
}
function sqlsacarCategoriaDocumento() {
    return `SELECT * FROM correspondencia_C_1.categoria_documento order by nombre`
}
function sqlsacarTipoDocuemnto(id) {
    return `SELECT * FROM correspondencia_C_1.tipo_documento where idcategoria_documento = ${id}`
}
function sqlsacarTipos_documento() {
    return `SELECT * FROM correspondencia_C_1.tipo_documento order by nombre`
}
function sqlAgregarEnlaceDocumento(idusuario, idhtPadre, idhtHijo) {
    return `call correspondencia_C_1.insertar_enlaces(${idhtPadre}, ${idhtHijo}, ${idusuario});`
}
function sqlSacarDocumentosHijos(idht) {
    return `SELECT enlaces.idht_padre as idhtp_padre, idht_hijo as idht_hijo, hoja_transmision.observacion as observacion,
    departamento.iddepartamento as iddepartamento, departamento.nombre as departamento, 
    usuario.idusuario as idusuario, usuario as usuario, 
    tipo_documento.idtipo_documento as idtipo_documento,  tipo_documento.nombre as tipo_documento,
    hoja_transmision.fecha_registro FROM correspondencia_C_1.enlaces
    
    join correspondencia_C_1.hoja_transmision on enlaces.idht_hijo=hoja_transmision.idht
    join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
    join correspondencia_C_1.departamento on usuario.iddepartamento=departamento.iddepartamento
    join correspondencia_C_1.tipo_documento on hoja_transmision.idtipo_documento=tipo_documento.idtipo_documento
    where idht_padre=${idht}`
}
function sqlSacarDocumentoPadre(idht) {
    return `SELECT enlaces.idht_padre as idht_padre, idht_hijo as idht_hijo, hoja_transmision.observacion as observacion,
    departamento.iddepartamento as iddepartamento, departamento.nombre as departamento, 
    usuario.idusuario as idusuario, usuario as usuario, 
    tipo_documento.idtipo_documento as idtipo_documento,  tipo_documento.nombre as tipo_documento,
    hoja_transmision.fecha_registro
    
     FROM correspondencia_C_1.hoja_transmision
    join correspondencia_C_1.tipo_documento on hoja_transmision.idtipo_documento=tipo_documento.idtipo_documento
    join correspondencia_C_1.enlaces on hoja_transmision.idht=enlaces.idht_padre
    join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
    join correspondencia_C_1.departamento on usuario.iddepartamento=departamento.iddepartamento
    where idht_hijo=${idht}`

}

function salSacarDocumentoRecibidos(iddepartamento){
    return `
    SELECT 
    estado.descripcion as descripcion_estado,
    hoja_transmision.fecha_registro as fecha_registro, 
    hoja_transmision.idht as hoja_transmision,
    clasificacion.idclasificacion as idclasificacion, clasificacion.descripcion as clasificacion,
     expediente,
     origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
     departamento.iddepartamento,departamento.nombre as destino, 
     color,color_,
     hoja_transmision.observacion as observacion,
     destinos.observacion as disposicion,
     usuario as usuario,
     hoja_transmision.idht,
     tipo_documento.nombre as tipo_nombre,tipo_documento.idtipo_documento as idtipo_documento,
     hoja_transmision.idht
     FROM correspondencia_C_1.destinos
     join correspondencia_C_1.departamento on destinos.iddepartamento=departamento.iddepartamento
     join correspondencia_C_1.estado on destinos.idestado=estado.idestado
     join correspondencia_C_1.hoja_transmision  on destinos.idht=hoja_transmision.idht
     join correspondencia_C_1.tipo_documento on hoja_transmision.idtipo_documento=tipo_documento.idtipo_documento
     join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion= clasificacion.idclasificacion
     join correspondencia_C_1.origen on hoja_transmision.idorigen =origen.idorigen
     join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
      where hoja_transmision.iddepartamento<>destinos.iddepartamento and destinos.iddepartamento=${iddepartamento}
      order by fecha_recibido desc limit 3000
    `
}
function sqlGuardarDepartamento(nombre){
     return `
     INSERT INTO correspondencia_C_1.departamento (nombre) VALUES ('${nombre}');

     `
}
function sqlEliminarDepartamento(iddepartamento){
    return `
    DELETE FROM correspondencia_C_1.departamento WHERE (iddepartamento = '${iddepartamento}');

    `
}
function sqlGuardarPersona(persona){
    return `
    INSERT INTO correspondencia_C_1.persona (identidad, nombre, direccion, telefono) VALUES 
    ('${persona.identidad}', '${persona.nombre}', '${persona.direccion}', '${persona.telefono}');

    `
}
function sqlguardarUsuario(departamento,data){
    return `
    INSERT INTO correspondencia_C_1.usuario (iddepartamento, identidad, usuario, contraseña) 
    VALUES ('${departamento.iddepartamento}', '${data.identidad}', '${data.usuario}', '${data.contrasena}');

    `
}
function sqlsacarUsuarios(){
    return `
    SELECT * FROM correspondencia_C_1.persona
join  correspondencia_C_1.usuario on usuario.identidad = persona.identidad
    `
}
function sqlcambiarContrasena(data){
    return `
        UPDATE correspondencia_C_1.usuario SET contraseña = '${data.contrasena}' WHERE (idusuario = '${data.idusuario}');
    `
}
function sqlCrearOrigen(nombre){
    return `
    INSERT INTO correspondencia_C_1.origen (descripcion) VALUES ('${nombre}');


    `
}
function sqlEliminarOrigen(data){
    return `
      DELETE FROM correspondencia_C_1.origen WHERE (idorigen = '${data.idorigen}');

    `
}
function sqlsacarPermisos(data){
    return `
        SELECT roles.idroles,descripcion,if(permisos.idroles is null,0,1) as estado FROM correspondencia_C_1.roles
        left join correspondencia_C_1.permisos on permisos.idroles = roles.idroles and idusuario=${data.idusuario}
    `
}

function sqlagregarPermiso(idroles,idusuario){
return `
INSERT INTO correspondencia_C_1.permisos (idroles, idusuario) VALUES ('${idroles}', '${idusuario}');


`
}
function sqlEliminarPermisos(idroles,idusuario){
    return `
    DELETE FROM correspondencia_C_1.permisos WHERE (idroles = '${idroles}') and (idusuario = '${idusuario}');


    `
}

function sacarDocumentosPorDestino_busqueda(data) {
 
 
        return `  
                    SELECT 
            estado.descripcion as descripcion_estado,hoja_transmision.fecha_registro as fecha_registro, hoja_transmision.idht as hoja_transmision,
            clasificacion.idclasificacion as idclasificacion, 
                clasificacion.descripcion as clasificacion,expediente,origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
                departamento.iddepartamento,color,color_, departamento.nombre as destino, hoja_transmision.observacion as observacion, destinos.observacion as disposicion, usuario as usuario,
                hoja_transmision.idht,tipo_documento.nombre as tipo_nombre,tipo_documento.idtipo_documento as idtipo_documento,hoja_transmision.idht
            FROM correspondencia_C_1.hoja_transmision 
            JOIN correspondencia_C_1.destinos on destinos.idht =  hoja_transmision.idht
            join correspondencia_C_1.estado on estado.idestado = destinos.idestado
            join correspondencia_C_1.origen on hoja_transmision.idorigen=origen.idorigen
                join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion=clasificacion.idclasificacion
                join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
                join correspondencia_C_1.departamento on hoja_transmision.iddepartamento=departamento.iddepartamento
                join correspondencia_C_1.tipo_documento on tipo_documento.idtipo_documento =  hoja_transmision.idtipo_documento
            where  hoja_transmision.iddepartamento = destinos.iddepartamento and hoja_transmision.iddepartamento=${data.iddepartamento}
            and concat(hoja_transmision.idht," ",hoja_transmision.observacion," ",expediente) like ("%${data.filtro}%")
            order by fecha_recibido desc limit 3000

            
   `
    
}

function buscarDocumentoRecibido_filtro(data){
    return `
    SELECT 
    estado.descripcion as descripcion_estado,
    hoja_transmision.fecha_registro as fecha_registro, 
    hoja_transmision.idht as hoja_transmision,
    clasificacion.idclasificacion as idclasificacion, clasificacion.descripcion as clasificacion,
     expediente,
     origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
     departamento.iddepartamento,departamento.nombre as destino, 
     color,color_,
     hoja_transmision.observacion as observacion,
     destinos.observacion as disposicion,
     usuario as usuario,
     hoja_transmision.idht,
     tipo_documento.nombre as tipo_nombre,tipo_documento.idtipo_documento as idtipo_documento,
     hoja_transmision.idht
     FROM correspondencia_C_1.destinos
     join correspondencia_C_1.departamento on destinos.iddepartamento=departamento.iddepartamento
     join correspondencia_C_1.estado on destinos.idestado=estado.idestado
     join correspondencia_C_1.hoja_transmision  on destinos.idht=hoja_transmision.idht
     join correspondencia_C_1.tipo_documento on hoja_transmision.idtipo_documento=tipo_documento.idtipo_documento
     join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion= clasificacion.idclasificacion
     join correspondencia_C_1.origen on hoja_transmision.idorigen =origen.idorigen
     join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
      where hoja_transmision.iddepartamento<>destinos.iddepartamento and destinos.iddepartamento=${data.iddepartamento}
        and concat(hoja_transmision.idht," ",hoja_transmision.observacion," ",expediente) like ("%${data.filtro}%")
        order by fecha_recibido desc limit 30000 
    `
}
function buscarDocumentoRecibido_X_Fecha(data){
    return `
    SELECT 
    estado.descripcion as descripcion_estado,
    hoja_transmision.fecha_registro as fecha_registro, 
    hoja_transmision.idht as hoja_transmision,
    clasificacion.idclasificacion as idclasificacion, clasificacion.descripcion as clasificacion,
     expediente,
     origen.idorigen as idorigen, origen.descripcion as descipcion_procedencia, 
     departamento.iddepartamento,departamento.nombre as destino, 
     color,color_,
     hoja_transmision.observacion as observacion,
     destinos.observacion as disposicion,
     usuario as usuario,
     hoja_transmision.idht,
     tipo_documento.nombre as tipo_nombre,tipo_documento.idtipo_documento as idtipo_documento,
     hoja_transmision.idht
     FROM correspondencia_C_1.destinos
     join correspondencia_C_1.departamento on destinos.iddepartamento=departamento.iddepartamento
     join correspondencia_C_1.estado on destinos.idestado=estado.idestado
     join correspondencia_C_1.hoja_transmision  on destinos.idht=hoja_transmision.idht
     join correspondencia_C_1.tipo_documento on hoja_transmision.idtipo_documento=tipo_documento.idtipo_documento
     join correspondencia_C_1.clasificacion on hoja_transmision.idclasificacion= clasificacion.idclasificacion
     join correspondencia_C_1.origen on hoja_transmision.idorigen =origen.idorigen
     join correspondencia_C_1.usuario on hoja_transmision.idusuario=usuario.idusuario
      where hoja_transmision.iddepartamento<>destinos.iddepartamento and destinos.iddepartamento=${data.iddepartamento}
        and date(fecha_recibido)=date("${data.fecha}")
        order by fecha_recibido desc limit 30000 
    `
}
module.exports = {
    sacarOrigen,
    sacarClasificaciones,
    guardarArchivo,
    insertarHT,
    sacarDocumentos,
    sacardocumento_de_ht,
    loginUser,
    sacarDepartamentos,
    insertarDestinosHT,
    sacarDocumentosPorDestino,
    sacarEstados,
    actualizarestadoDestino,
    agregarComentario,
    sacarComentario,
    sacarSecretarioEstado,
    sacarEstadosdeht,
    sqlsacarCategoriaDocumento,
    sqlsacarTipoDocuemnto,
    sqlsacarTipos_documento,
    sqlAgregarEnlaceDocumento,
    sqlSacarDocumentosHijos,
    sqlSacarDocumentoPadre,
    salSacarDocumentoRecibidos,
    sqlGuardarDepartamento,
    sqlEliminarDepartamento,
    sqlGuardarPersona,
    sqlguardarUsuario,
    sqlsacarUsuarios,
    sqlcambiarContrasena,
    sqlCrearOrigen,
    sqlEliminarOrigen,
    sqlsacarPermisos,
    sqlagregarPermiso,
    sqlEliminarPermisos,
    sacarDocumentosPorDestino_busqueda,
    buscarDocumentoRecibido_filtro,
    buscarDocumentoRecibido_X_Fecha

}