"use stric"
const { query, response } = require("express")
var db= require("../db/db")
var consultas = require("../querys/consultas")
var correo = require("./controldor_correo")
var fs = require("fs")
var jwt = require("../token/autenticacion");
const bcrypt = require('bcrypt');
const { error } = require("console")

 /*
correo.enviarCorreo("destinatario@example.com", "Prueba Nodemailer", "Este es un mensaje de prueba.")
.then(() => console.log("Correo enviado con éxito"))
.catch((err) => console.error("Fallo en el envío del correo:", err));
 */
function prueba(req,res){
    res.status(200).send({mensaje:"Prueba"})
}

function crearOrganizacion(req,res){
    let p= req.body
    let sql =`
    INSERT INTO correspondencia_C_1.organizacion 
    (nombre, direccion) VALUES ('${p.nombre}', '${p.direccion}');
    `
    console.log(sql)
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
         res.status(200).send({resultado:"Guardado con exito"})
    })
}


function agregarEntidad(req,res){
    let p= req.body
    let sql =`
         INSERT INTO correspondencia_C_1.entidad
          (idorganizacion, idpadre, nombre, descripcion, tipo) VALUES
           ('${p.idorganizacion}', ${p.idpadre?p.idpadre:null}, '${p.nombre}', '${p.descripcion}', '${p.tipo.identidad_tipo}');

    `
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
         res.status(200).send({resultado:"Guardado con exito"})
    })
}

function eliminarOrganizacion(req,res){
    let p = req.body
    let sql =`
    DELETE FROM correspondencia_C_1.organizacion WHERE (idorganizacion = '${p.idorganizacion}');

    `
    console.log(sql)
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
         res.status(200).send({resultado:"Eliminado con exito"})
    })
}
function modificarOrganizacion(req,res){
    let p = req.body
    let sql = `
    UPDATE correspondencia_C_1.organizacion 
    SET nombre = '${p.nombre}', direccion = '${p.direccion}' WHERE (idorganizacion = '${p.idorganizacion}');

    `
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
         res.status(200).send({resultado:"Modificado con exito"})
    })
}
function eliminarEntidad(req,res){
    let p = req.body
    let sql = `
    DELETE FROM correspondencia_C_1.entidad WHERE (identidad = '${p.identidad}');

    `
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
         res.status(200).send({resultado:"Eliminado con exito"})
    })
}

function modificarEntidad(req,res){
    let p = req.body
    let sql = `
          UPDATE correspondencia_C_1.entidad 
          SET idorganizacion = '${p.idorganizacion}', 

          identidad_tipo = '${p.identidad_tipo}',
            idpadre = ${p.idpadre?p.idpadre:null}, 
           nombre = '${p.nombre}',
            descripcion = '${p.descripcion}'
             WHERE (identidad = '${p.identidad}');

    `
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
         res.status(200).send({resultado:"Modificado con exito"})
    })
}
function sacarOrganizacion(req,res){
    let p = req.body
    let sql = `
       SELECT * FROM correspondencia_C_1.organizacion;

    `
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(result.length===0) return res.status(200).send({mensaje:"No se encontro ninguna organizacion"})
         res.status(200).send({resultado:result})
    })
}
function sacarEntidad(req,res){
    let p = req.body
    let sql = `
      SELECT * FROM correspondencia_C_1.entidad;
    `
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(result.length===0) return res.status(200).send({mensaje:"No se encontro ninguna entidad"})

         res.status(200).send({resultado:result})
    })
}
function sacarTipoEntidad(req,res){
    let p = req.body
    let sql = `
    SELECT * FROM correspondencia_C_1.entidad_tipo;
    `
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(result.length===0) return res.status(200).send({mensaje:"No se encontro ninguna entidad"})

         res.status(200).send({resultado:result})
    })
}

function sacarPadresEntidad(req,res){
    let sq=`
    SELECT * FROM correspondencia_C_1.entidad
 where idorganizacion=${req.body.idorganizacion} 
    `
    db.query(sq,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(result.length===0) return res.status(200).send({mensaje:"No se encontro ninguna entidad padre"})

         res.status(200).send({resultado:result})
    })
}

function guadarEntidad(req,res){
    let p = req.body
    let sql =`
    INSERT INTO correspondencia_C_1.entidad (idorganizacion, identidad_tipo
      ${p.idpadre? ',idpadre':''}, nombre, descripcion) VALUES
      ('${p.idorganizacion}', '${p.identidad_tipo}' ${p.idpadre? ',"'+p.idpadre+'"':''}, '${p.nombre}', '${p.descripcion}');
    `
    console.log(sql)
    db.query(sql,(error,result,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        res.status(200).send({resultado:"Guardado con exito"})
    })
}
function sacarEntidades_X_Organizacion(req,res){
    let sql =`

 WITH RECURSIVE Jerarquia AS (
    -- Paso base: Obtener la raíz (los nodos sin padre)
    SELECT 
        e.identidad, 
        e.nombre, 
        e.idpadre, 
        e.descripcion, 
        e.identidad_tipo,
        1 AS nivel,
        CAST(e.nombre AS CHAR(255)) AS path -- Inicia el camino con el nombre de la entidad
    FROM correspondencia_C_1.entidad e
    WHERE e.idpadre IS NULL AND e.idorganizacion =${req.body.idorganizacion}
    
    UNION ALL
    
    -- Paso recursivo: Obtener los hijos y aumentar el nivel
    SELECT 
        e.identidad, 
        e.nombre, 
        e.idpadre, 
        e.descripcion,
        e.identidad_tipo, 
        j.nivel + 1,
        CONCAT(e.nombre, ' -> ', j.path) AS path -- Invertimos el orden del camino
    FROM correspondencia_C_1.entidad e
    INNER JOIN Jerarquia j ON e.idpadre = j.identidad
)

-- Consulta final ordenada por la jerarquía invertida
SELECT * 
FROM Jerarquia 
ORDER BY path ASC;
 

 `
 /**
  * WITH RECURSIVE Jerarquia AS (
    -- Paso base: Obtener la raíz (los nodos sin padre)
    SELECT 
        e.identidad, 
        e.nombre, 
        e.idpadre, 
        e.descripcion, 
          e.identidad_tipo,
        1 AS nivel,
        CAST(e.nombre AS CHAR(255)) AS path,
        cAST(e.nombre AS CHAR(255)) AS path_rever -- Inicia el camino con el nombre de la entidad
    FROM correspondencia_C_1.entidad e
    WHERE e.idpadre IS NULL and idorganizacion=
    
    UNION ALL
    
    -- Paso recursivo: Obtener los hijos y aumentar el nivel
    SELECT 
        e.identidad, 
        e.nombre, 
        e.idpadre, 
        e.descripcion,
         e.identidad_tipo, 
        j.nivel + 1,
        CONCAT(j.path, ' -> ', e.nombre) AS path, -- Agregar el nombre al camino
        CONCAT(e.nombre, ' -> ', j.path) AS path_rever
    FROM correspondencia_C_1.entidad e
    INNER JOIN Jerarquia j ON e.idpadre = j.identidad
)

-- Consulta final ordenada primero por idpadre y luego por nivel
SELECT * 
FROM Jerarquia 
ORDER BY   path asc;

  */
 console.log("@@@@@@@@@@@@@@@@@@@@@@@@@2")
 console.log(sql)
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length ===0) return res.status(200).send({mensaje:"Esta organizacion no contiene deparatamentos/seccion"})
        res.status(200).send({resultado:resultado})
    })
}
 
function agregarFirmas(req,res){
    let p =req.body
    console.log(p)
    let sql = `
    INSERT INTO correspondencia_C_1.firmas
     (identidad, estado, grado, nombre, cargo, fecha,fecha_sistema,serie) 
     VALUES ('${p.nodo.identidad}', '${p.estado}', '${p.grado}', '${p.nombre}', '${p.cargo}', '${p.fecha}',now(),'${p.Serie}');

    `
    console.log(sql)
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
          res.status(200).send({resultado:"Firma Agregada con exito"})
    })
}
function sacarFirmas(req,res){
  let sql = `
          SELECT * FROM correspondencia_C_1.firmas where identidad=${req.body.identidad} and estado=1
  `
  db.query(sql,(error,resultado,field)=>{
    if(error) return res.status(200).send({error:error.sqlMessage})
    if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron firmas"})

      res.status(200).send({resultado:resultado})
})
}

function eliminarFirmas(req,res){
    let sql=`
    DELETE FROM correspondencia_C_1.firmas WHERE (idfirmas = '${req.body.idfirmas}');

    `
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
      
          res.status(200).send({resultado:"Eliminado con exito"})
    })
}
function modificarFirmas(req,res){
    let p = req.body
    let sql =`
   UPDATE correspondencia_C_1.firmas 
   SET 
    estado = '${p.estado}', 
    grado = '${p.grado}', 
    nombre = '${p.nombre}', 
    serie = '${p.serie}', 

    cargo = '${p.cargo}' 
    WHERE (idfirmas = '${p.idfirmas}');

    `
    console.log(sql)
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
      
          res.status(200).send({resultado:"Modificado con exito"})
    })
}

function sacarorigen(req,res){
    let sql = `SELECT * FROM correspondencia_C_1.origenes;`
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron origenes"})

                res.status(200).send({resultado:resultado})
    })
}
function sacarClasificacion(req,res){
    let sql = `SELECT * FROM correspondencia_C_1.correspondencia_clasificacion;`
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron clasificaciones"})

                res.status(200).send({resultado:resultado})
    })
}
function sacarTipoCorrespondencia(req,res){
    let sql = `SELECT * FROM correspondencia_C_1.correspondencia_tipo;`
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron los tipos"})

                res.status(200).send({resultado:resultado})
    })
}

function sacarNivelAtencion(req,res){
    let sql = `SELECT * FROM correspondencia_C_1.correspondencia_nivel_atencion;`
    db.query(sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron los niveles de atencion"})

                res.status(200).send({resultado:resultado})
    })
}

 async  function guardarTiketCorrespondencia(req,res){
    let param = req.body;
    var p = JSON.parse(param.parametros)
    console.log(p)
    let buscaEstado = await sacarestadoDefault();
    if(buscaEstado.error){
        console.log("antes de eliminar archivo");
        console.log(req.files)
        eliminarArchivosPloque(req.files)
        return res.status(200).send({mensaje:buscaEstado.error})
    }

 
    let sql = `
    INSERT INTO correspondencia_C_1.correspondencia (identidad, idorigenes, fecha, 
    fecha_sistema, texto,expediente,
    idprioridad,idtipo,idclasificacion,fecha_limite,idusuario ${p.f1?',firma1':'' } ${p.f2?',firma2':'' } ${p.f3?',firma3':'' }) 
    VALUES ('${p.identidad}', '${p.origen.idorigenes}', '${p.fecha}', now(), '${p.descripcion}',
    '${p.expediente}',${p.idprioridad},${p.idtipo},${p.idclasificacion},${p.fecha_limite?"'"+p.fecha_limite+"'":null},${p.usuario.idusuario}
    ${p.f1?','+p.f1:'' }  ${p.f2?','+p.f2:'' }  ${p.f3?','+p.f3:'' });
    `
    console.log(sql)
    
    let esperar = await new Promise((resolve,reject)=>{
        db.query(sql,(error,resultado,field)=>{
            if(error) return resolve({error:error.sqlMessage})
              return  resolve({resultado:resultado})
        })
    })

    if (esperar.error) return   res.status(200).send({error:esperar.error})

console.log(esperar.resultado)
let idCorrespondencia = esperar.resultado.insertId
guardarArchivosBloque(req.files,idCorrespondencia,p.idusuario,p.identidad)
compartirConUsuario(p.compartir,idCorrespondencia,p.usuario.idusuario) 
enviarCorreoAlcompartirDocumento(p.compartir,idCorrespondencia,p.usuario)
guardarMasOrigenes(idCorrespondencia,p.masOrigenes)

console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%55")
console.log(p.compartir)
p.compartir.push(p.usuario)
console.log(p.compartir)

guardarEstado_control(p.compartir,idCorrespondencia,buscaEstado.id)

//
res.status(200).send({resultado:"Correspondencia guardada con exito",idCorrespondencia:idCorrespondencia})
//req.files
}

 
function guardarMasOrigenes(idcorrespondencia, marOrigenes) {

  if (!marOrigenes || marOrigenes.length === 0) return;

  let valores = marOrigenes.map(o => 
    `(${idcorrespondencia},${o.idorigenes})`
  ).join(",");

  let sql = `
    INSERT INTO correspondencia_C_1.correspondencias_mas_origenes
    (idcorrespondencia, idorigen)
    VALUES ${valores};
  `;
console.log(sql)
  db.query(sql, (error, resultado) => {
    if (error) console.error(error);
  });
}


function guardarArchivosBloque(archivo,idCorrespondencia,idusuario,id_entidad){
    for (let index = 0; index < archivo.length; index++) {
        let sql =`
        INSERT INTO correspondencia_C_1.archivos
         (idcorrespondencia, dir, nombre, usuario, fecha_sistema,id_entidad) 
         VALUES ('${idCorrespondencia}', '${archivo[index].filename}', '${archivo[index].originalname}',${idusuario}, now(),${id_entidad});

        `
        console.log(sql)
        db.query( sql,(error,resultado,field)=>{
          })
     }
 
}

const rondas = 10;  
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, rondas);
      return hashedPassword;
}

async function  guardarUsuarios(req,res){
    let p = req.body
    let password =await   hashPassword(p.contrasena);
    
    let sql = `
         INSERT INTO correspondencia_C_1.usuario (id_entidad, nombre, contrasena, usuario, correo, celular)
          VALUES ('${p.depto.identidad}', '${p.nombre}', '${password}', '${p.usuario}', '${p.correo}','${p.telefono}');
    `
    console.log(sql)
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        return res.status(200).send({resultado:"Usuario Guardado con exito"})

    })
}

function sacarTodoUsuario(req,res){
    let sql =`
SELECT *, entidad.nombre as depto,usuario.nombre as nombre_usuario FROM correspondencia_C_1.usuario
join  correspondencia_C_1.entidad on entidad.identidad =usuario.id_entidad
     `
     db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron usuarios"})
        return res.status(200).send({resultado:resultado})

    })
}
function eliminarUsuario(req,res){
    let sql = `
    DELETE FROM correspondencia_C_1.usuario WHERE (idusuario = '${req.body.idusuario}');

    `
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
 
        return res.status(200).send({resultado:"Eliminado con exito"})

    })
}

function modificarUsuario(req,res){
    let p=req.body
    let sql=`
    UPDATE correspondencia_C_1.usuario
     SET id_entidad = '${p.depto.identidad}', 
     nombre = '${p.nombre}',
    
       usuario = '${p.usuario}',
        correo = '${p.correo}', 
        celular = '${p.telefono}'
         WHERE (idusuario = '${p.idusuario}');

    `
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
 
        return res.status(200).send({resultado:"Modificado con exito"})

    })
}
function detectarInyeccion(input) {
    if (!input || typeof input !== "string") return false;

    // Expresiones regulares para detectar patrones de inyección SQL
    const sqlInjectionPatterns = [
        /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|REPLACE|EXEC)\b)/i, // Comandos SQL comunes
        /(--|#|\/\*)/, // Comentarios SQL
        /(\b(OR|AND)\b\s+[^\s]+=\s*[^\s]+)/i, // Condiciones como 'OR 1=1'
        /(\b(WHERE|HAVING|LIKE)\b\s*['"]?\s*(\%|\*|[^\w\s])+\s*['"]?)/i, // Uso de patrones sospechosos en WHERE
        /(\b(IF|CASE|WHEN|THEN|ELSE|END)\b)/i, // Intentos de lógica SQL
        /(;|--|\bEXEC\b|\bXP_)/i, // Comandos sospechosos
        /(\b(SLEEP|BENCHMARK)\b\()/i, // Intentos de ataques de tiempo
    ];

    return sqlInjectionPatterns.some((pattern) => pattern.test(input));
}


async function loguiarse(req,res){
    let p =req.body
    console.log("New has")
   console.log( await hashPassword(p.contrasena))

    if (detectarInyeccion(p.usuario) || detectarInyeccion(p.contrasena))  return res.status(200).send({mensaje:"Se detecto intento de inyeccion SQL 🕵️‍♀️"})


let traerContrasena=`SELECT contrasena FROM correspondencia_C_1.usuario
    join  correspondencia_C_1.entidad on entidad.identidad =  usuario.id_entidad
     where  usuario='${p.usuario}' `
console.log(traerContrasena)
  let esperarpeticion = await new Promise((resolve,reject)=>{
    db.query( traerContrasena,(error,resultado,field)=>{
        if(error) return resolve({error:error.sqlMessage})
        if(resultado.length===0) return resolve({mensaje:"Datos no encontrados......"})
        return  resolve({resultado:resultado})

    })
  })
  if (esperarpeticion.error) return res.status(200).send({error:"Error de db"})
  if (esperarpeticion.mensaje) return res.status(200).send({mensaje:"Credenciales incorrectas 🕵️‍♀️"})
console.log(esperarpeticion.resultado[0].contrasena)

  const match = await verificarContrasena(p.contrasena, esperarpeticion.resultado[0].contrasena);
  if (match) {
    let sql = `SELECT idusuario,id_entidad,usuario,correo,celular,idorganizacion,usuario.nombre as nombre,
    entidad.nombre as depto FROM correspondencia_C_1.usuario
        join  correspondencia_C_1.entidad on entidad.identidad =  usuario.id_entidad
         where  usuario='${p.usuario}'`
        db.query( sql,(error,resultado,field)=>{
            if(error) return res.status(200).send({error:error.sqlMessage})
            if(resultado.length===0) return res.status(200).send({mensaje:"Credenciales incorrectas"})
    
                let permisos =`
                        SELECT 
                            idusuario_permiso,
                                permisos.idpermisos AS idpermiso,
                                permisos.nombre AS nombre_permiso,
                                usuario_permiso.idusuario,
                                IF(usuario_permiso.idusuario IS NULL, false, true) AS autorizado
                            FROM 
                                correspondencia_C_1.permisos
                            LEFT JOIN 
                                correspondencia_C_1.usuario_permiso 
                                ON usuario_permiso.idpermisos = permisos.idpermisos
                                AND usuario_permiso.idusuario = ${resultado[0].idusuario}
                            ORDER BY 
                                permisos.idpermisos;
                `
                console.log(permisos)
                console.log(resultado)
                db.query( permisos,(error,resultadoPermisos,field)=>{
                    if(error) return res.status(200).send({error:error.sqlMessage})
                        return res.status(200).send({
                            resultado:resultado,
                            token: jwt.sacarToken(resultado) ,
                            permisos:resultadoPermisos
                         })
                })
          
    
        })
  }else{
    return res.status(200).send({error:"Credenciales incorrectas 🕵️‍♀️"})
  }



}

async function verificarContrasena(passwordIngresada, hashGuardado) {
    const match = await bcrypt.compare(passwordIngresada, hashGuardado);
    return match;
}

function buscarUsuario(req,res){
    let p = req.body 
    let sql=`
    SELECT *,false as compartir_depto FROM correspondencia_C_1.vista_usuario_depto
     where concat(usuario_," ",depto," ",correo) like "%${p.texto}%"
    `
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"Datos no encontrados......"})
        return res.status(200).send({resultado:resultado})

    })
}

function compartirConUsuario(arreglo,idcorrespondencia,idusuario_emisor){
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
    console.log(arreglo)
if(arreglo.length!==0){
    let cadena =''
     
    for (let index = 0; index < arreglo.length; index++) {
      cadena +=`(${arreglo[index].idusuario},${idcorrespondencia},now(),${idusuario_emisor}),`
       console.log("cadena")
       console.log(cadena)
     
    }
    
    let bulk = cadena.substring(0,cadena.length-1);
     
    let sql = `INSERT INTO correspondencia_C_1.correspondencia_compartidos_usuario
    (idusuario_receptor, idcorrespondencia, fecha_sistema,idusuario_emisor) 
    VALUES ${bulk} ` 
    console.log("Compartir")
    console.log(sql)
    db.query( sql,(error,resultado,field)=>{
    
 
 })
}

}
 
 async function sacarCorrespondenciaPorUsuario(req,res){
    let p =req.body
    let sql =`
  select * from(select T.*,
  concat(T.idcorrespondencia," ",T.expediente," ",nombre_origen," ",nombre_prioridad," ",estado_correspondencia," ",T.texto)   as filtro
  from ( SELECT correspondencia.idcorrespondencia,correspondencia.identidad,expediente,
correspondencia.idprioridad,correspondencia.idtipo,
correspondencia.idclasificacion,correspondencia.fecha,fecha_sistema,texto,
origenes.nombre as nombre_origen,
correspondencia_nivel_atencion.nombre as nombre_prioridad,
correspondencia_nivel_atencion.color as color_prioridad,
correspondencia_tipo.nombre as nombre_tipo,
correspondencia_clasificacion.nombre as nombre_clasificacion,
correspondencia_clasificacion.color as clasificacion_color,
(select correspondencia_C_1.sacar_estado_corres(correspondencia.idcorrespondencia)) as estado_correspondencia,
correspondencia.idusuario
 

 FROM correspondencia_C_1.correspondencia
join correspondencia_C_1.origenes on origenes.idorigenes = correspondencia.idorigenes
join correspondencia_C_1.correspondencia_nivel_atencion on correspondencia_nivel_atencion.id_nivel_atencion = correspondencia.idprioridad
 join correspondencia_C_1.correspondencia_tipo on correspondencia_tipo.id_tipo = correspondencia.idtipo
  join correspondencia_C_1.correspondencia_clasificacion on correspondencia_clasificacion.id_clasificacion = correspondencia.idclasificacion
 where idusuario=${p.idusuario} order by fecha_sistema desc)as T) as D where 1=1 ${p.cadena} limit 200
  
    `
    console.log(p)
    console.log(sql)
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})


         return res.status(200).send({resultado:resultado})

    })

 
}
function sacarArchivosPDF(req, res) {
    var params = req.params;
    console.log(params)
    console.log("Devolver imagen")
    res.sendFile(params.id, { root: "Archivos/directorios" });
}
function sacarArchivosCorrespondencia(req,res){
    let sql =`
  SELECT idarchivos,usuario.idusuario,idcorrespondencia,idarchivos,dir,archivos.nombre as nombre_archivo,
  fecha_sistema,archivos.id_entidad,usuario.nombre,correo,celular,entidad.nombre as depto FROM correspondencia_C_1.archivos 
    join correspondencia_C_1.entidad on entidad.identidad = archivos.id_entidad
    join  correspondencia_C_1.usuario on usuario.idusuario = archivos.usuario
        where idcorrespondencia=${req.body.idcorrespondencia}
        order by fecha_sistema desc
    `
    console.log(sql)
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})


         return res.status(200).send({resultado:resultado})

    })

}

async function agregarComentarioDocumento(req,res){
    let p =req.body
    console.log(p)
      agregarComentario(p.idarchivos,p.idusuario,p.texto,p.id_entidad,p.idpadre_comentario )
      res.status(200).send({resultado:"Comentario Agregado con exito"})
}

function agregarComentario(idarchivo, idusuario, texto,id_entidad,idpadre_comentario){
    console.log(idpadre_comentario)
let sql =`INSERT INTO correspondencia_C_1.comentarios_archivo (idarchivo, idusuario,
 fecha_sistema, texto,id_entidad ${idpadre_comentario?',idpadre_comentario':''})
 VALUES ('${idarchivo}', '${idusuario}',now(), '${texto}',${id_entidad} ${idpadre_comentario?','+idpadre_comentario:''});
 `
 console.log(sql)
  db.query(sql,(error1,result,fiel)=>{
    if(error1) console.log(error1)
  })
}
 
function sacarcomentarioArchivo(req,res){
    let sql =`
    SELECT usuario_,correo,idarchivo,comentarios_archivo.idusuario,comentarios_archivo.id_entidad,nombre as depto,fecha_sistema,texto FROM correspondencia_C_1.comentarios_archivo
join correspondencia_C_1.vista_usuario_depto on  vista_usuario_depto.idusuario =comentarios_archivo.idusuario
join  correspondencia_C_1.entidad on entidad.identidad = comentarios_archivo.id_entidad
where idarchivo=${req.body.idarchivo} order by fecha_sistema
    `
  db.query(sql,(error1,result,fiel)=>{
    if(error1) return res.status(200).send({error1:error1.sqlMessage})
    if(result.length===0) return res.status(200).send({mensaje:"No contiene comentario"})
         return res.status(200).send({resultado:result})
  
  })

}

function  cargarMasArchivoCorrespondecia(req,res){
    let param = req.body;
    var p = JSON.parse(param.parametros)
    
    guardarArchivosBloque(req.files,p.idcorrespondencia,p.usuario.idusuario,p.usuario.id_entidad)
    enviarCorreoSubirArchivo(p.idcorrespondencia)
    res.status(200).send({resultado:"Archivos Guardado con exito"})
}
function agregarDisposicion(req,res){
    let p =req.body
let sql =`
INSERT INTO correspondencia_C_1.correspondencia_disposicion
(idusuario, id_entidad, fecha_sistema, texto,idcorrespondencia) VALUES
 ('${p.usuario.idusuario}', '${p.usuario.id_entidad}', now(), '${p.texto}',${p.idcorrespondencia});

`
db.query(sql,(error1,result,fiel)=>{
    if(error1) return res.status(200).send({error1:error1.sqlMessage})
          return res.status(200).send({resultado:"Dispocicion Agregada con exito"})
   })
}

function sacarDisposicion(req,res){
    let p = req.body
    let sql = `
    SELECT idcorrespondencia_disposicion,fecha_sistema,texto,usuario,usuario.idusuario,entidad.identidad as id_entidad,
entidad.nombre as depto FROM correspondencia_C_1.correspondencia_disposicion
join correspondencia_C_1.entidad on entidad.identidad =correspondencia_disposicion.id_entidad
join correspondencia_C_1.usuario on usuario.idusuario =correspondencia_disposicion.idusuario
where idcorrespondencia=${p.idcorrespondencia}
    `
    console.log(sql)
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
        if(result.length===0) return res.status(200).send({mensaje:"No contiene disposicion"})
             return res.status(200).send({resultado:result})
      
      })
}
function eliminarArchivos(direccion, nombre) {
    const path = direccion + nombre

    try {
        console.log("Eliminando archivo ......")
        fs.unlinkSync(path)

    } catch (err) {
        console.error(err)
    }
}
function eliminarArchivosPloque(data) {
    console.log("Elimina archivos bloque")
    data.forEach((element) => {
      eliminarArchivos("Archivos/directorios/",element.filename);
    });
  }

  function eliminarArchivoCorrespondencia(req,res){
    let p = req.body
    let sql = `
    DELETE FROM correspondencia_C_1.archivos WHERE (idarchivos = '${p.archivo.idarchivos}');
    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            eliminarArchivos("Archivos/directorios/",p.archivo.dir);
             return res.status(200).send({resultado:"Eliminado con exito"})
      
      })
  }
  function sacarUsuarioCompartidoCorrespondencia(req,res){
    let p = req.body
    let sql = `
    SELECT idusuario_receptor as idusuario,pertenece,id_entidad,usuario_,depto,true as compartir_depto FROM correspondencia_C_1.correspondencia_compartidos_usuario
join  correspondencia_C_1.vista_usuario_depto on vista_usuario_depto.idusuario = correspondencia_compartidos_usuario.idusuario_receptor
where idcorrespondencia=${p.idcorrespondencia}
    `
    console.log(sql)
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
        if(result.length===0) return res.status(200).send({mensaje:"No se a compartido"})

          
             return res.status(200).send({resultado:result})
      
      })
  }

   async function compartirMasUsuario(req,res){
    let p=req.body
    console.log(p)
   let buscaEstado = await sacarestadoDefault();
   if(buscaEstado.error) return res.status(200).send({mensaje:buscaEstado.error})
 console.log(buscaEstado)

     compartirConUsuario(p.compartir,p.idCorrespondencia,p.usuario.idusuario) 
     guardarEstado_control(p.compartir,p.idCorrespondencia,buscaEstado.id)
    enviarCorreoAlcompartirDocumento(p.compartir,p.idCorrespondencia,p.usuario)

     return res.status(200).send({resultado:"Compartido con exito"})

  }

  function sacarCorrespondeciasCompartidasUsuario(req,res){
    let p = req.body
    let sql =`
     
 select * from(select T.*,
 concat(T.expediente," ",nombre_origen," ",nombre_prioridad," ",estado_correspondencia)  as filtro
from(SELECT correspondencia.idcorrespondencia,correspondencia.identidad,expediente,
correspondencia.idprioridad,correspondencia.idtipo,
correspondencia.idclasificacion,correspondencia.fecha,correspondencia_compartidos_usuario.fecha_sistema,texto,
origenes.nombre as nombre_origen,
correspondencia_nivel_atencion.nombre as nombre_prioridad,
correspondencia_nivel_atencion.color as color_prioridad,
correspondencia_tipo.nombre as nombre_tipo,
correspondencia_clasificacion.nombre as nombre_clasificacion,
correspondencia_clasificacion.color as clasificacion_color,
(select correspondencia_C_1.sacar_estado_corres(correspondencia.idcorrespondencia)) as estado_correspondencia,
correspondencia.idusuario
 FROM correspondencia_C_1.correspondencia_compartidos_usuario
 join correspondencia_C_1.correspondencia on correspondencia.idcorrespondencia =correspondencia_compartidos_usuario.idcorrespondencia
join correspondencia_C_1.origenes on origenes.idorigenes = correspondencia.idorigenes
join correspondencia_C_1.correspondencia_nivel_atencion on correspondencia_nivel_atencion.id_nivel_atencion = correspondencia.idprioridad
 join correspondencia_C_1.correspondencia_tipo on correspondencia_tipo.id_tipo = correspondencia.idtipo
  join correspondencia_C_1.correspondencia_clasificacion on correspondencia_clasificacion.id_clasificacion = correspondencia.idclasificacion
 where idusuario_receptor=${p.idusuario}
  order by fecha_sistema desc) as T) as D where 1=1 ${p.cadena} limit 200



    `
    /**
    SELECT correspondencia.idcorrespondencia,correspondencia.identidad,expediente,
correspondencia.idprioridad,correspondencia.idtipo,
correspondencia.idclasificacion,correspondencia.fecha,correspondencia_compartidos_usuario.fecha_sistema,texto,
origenes.nombre as nombre_origen,
correspondencia_nivel_atencion.nombre as nombre_prioridad,
correspondencia_nivel_atencion.color as color_prioridad,
correspondencia_tipo.nombre as nombre_tipo,
correspondencia_clasificacion.nombre as nombre_clasificacion,
correspondencia_clasificacion.color as clasificacion_color
 FROM correspondencia_C_1.correspondencia_compartidos_usuario
 join correspondencia_C_1.correspondencia on correspondencia.idcorrespondencia =correspondencia_compartidos_usuario.idcorrespondencia
join correspondencia_C_1.origenes on origenes.idorigenes = correspondencia.idorigenes
join correspondencia_C_1.correspondencia_nivel_atencion on correspondencia_nivel_atencion.id_nivel_atencion = correspondencia.idprioridad
 join correspondencia_C_1.correspondencia_tipo on correspondencia_tipo.id_tipo = correspondencia.idtipo
  join correspondencia_C_1.correspondencia_clasificacion on correspondencia_clasificacion.id_clasificacion = correspondencia.idclasificacion
 where idusuario_receptor=${p.idusuario}
  order by fecha_sistema desc */
  console.log(sql)
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
        if(result.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})

          
             return res.status(200).send({resultado:result})
      
      })
  }
  function guardarOrigenes(req,res){
    let p =req.body
    let sql =`
        INSERT INTO correspondencia_C_1.origenes (nombre) VALUES ('${p.nombre}');
    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
        return res.status(200).send({resultado:"Guardado con exito"})
      
      })
  }
  function modificarOrigenes(req,res){
    let p =req.body

    let sql =`
    UPDATE correspondencia_C_1.origenes SET nombre = '${p.nombre}' WHERE (idorigenes = '${p.idorigenes}');

    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
        return res.status(200).send({resultado:"Modificado con exito"})
      
      })
  }


  function eliminarOrigenes(req,res){
    let p =req.body
 
    let sql = `
DELETE FROM correspondencia_C_1.origenes WHERE (idorigenes = '${p.idorigenes}');


    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
    

        return res.status(200).send({resultado:"Eliminado con exito" })
      
      })
  }

  function guardarClasificacion(req,res){
    let p = req.body
                let sql =`
                INSERT INTO correspondencia_C_1.correspondencia_clasificacion 
                  (nombre, color) VALUES ('${p.nombre}', '---');
                `
                db.query(sql,(error1,result,fiel)=>{
                    if(error1) return res.status(200).send({error1:error1.sqlMessage})
                          
                    return res.status(200).send({resultado:"Guardado  con exito" })
                  
                  })

  }
  function modificarClasificacion(req,res){
    let p = req.body
                let sql =`
                        UPDATE correspondencia_C_1.correspondencia_clasificacion 
                        SET nombre = '${p.nombre}' 
                        WHERE (id_clasificacion = '${p.id_clasificacion}');

                `
                db.query(sql,(error1,result,fiel)=>{
                    if(error1) return res.status(200).send({error1:error1.sqlMessage})
                          
                    return res.status(200).send({resultado:"Modificado  con exito" })
                  
                  })

  }
  function EliminarClasificacion(req,res){
    let p = req.body
                let sql =`
          DELETE FROM correspondencia_C_1.correspondencia_clasificacion WHERE (id_clasificacion = '${p.id_clasificacion}');

                `
                db.query(sql,(error1,result,fiel)=>{
                    if(error1) return res.status(200).send({error1:error1.sqlMessage})
                          
                    return res.status(200).send({resultado:"Eliminado  con exito" })
                  
                  })

  }



  function guardarPrioridad(req,res){
    let p = req.body
    let sql = `
    INSERT INTO correspondencia_C_1.correspondencia_nivel_atencion
     (nombre, color) VALUES ('${p.nombre}', '${p.color}');

    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            
        return res.status(200).send({resultado:"Guardado  con exito" })
      
      })
  }

  
  function EliminarPrioridad(req,res){
    let p = req.body
    let sql = `
   DELETE FROM correspondencia_C_1.correspondencia_nivel_atencion WHERE (id_nivel_atencion = '${p.id_nivel_atencion}');


    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            
        return res.status(200).send({resultado:"Eliminado  con exito" })
      
      })
  }

   
  function ModificarPrioridad(req,res){
    let p = req.body
    let sql = `
            UPDATE correspondencia_C_1.correspondencia_nivel_atencion 
            SET nombre = '${p.nombre}',color = '${p.color}' WHERE (id_nivel_atencion = '${p.id_nivel_atencion}');

    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            
        return res.status(200).send({resultado:"Modificado  con exito" })
      
      })
  }



  function guardarTipo(req,res){
    let p = req.body
    let sql= `
    INSERT INTO correspondencia_C_1.correspondencia_tipo (nombre) VALUES ('${p.nombre}');

    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            
        return res.status(200).send({resultado:"Guardado  con exito" })
      
      })
  }

  function guardarTipo(req,res){
    let p = req.body
    let sql= `
    INSERT INTO correspondencia_C_1.correspondencia_tipo (nombre) VALUES ('${p.nombre}');

    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            
        return res.status(200).send({resultado:"Guardado  con exito" })
      
      })
  }

  function eliminarTipo(req,res){
    let p = req.body
    let sql= `
  DELETE FROM correspondencia_C_1.correspondencia_tipo WHERE (id_tipo = '${p.id_tipo}');

    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            
        return res.status(200).send({resultado:"Eliminado  con exito" })
      
      })
  }
  function modificarTipo(req,res){
    let p = req.body
    let sql= `
UPDATE correspondencia_C_1.correspondencia_tipo
 SET nombre = '${p.nombre}'
  WHERE (id_tipo = '${p.id_tipo}');

    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
            
        return res.status(200).send({resultado:"Modificado  con exito" })
      
      })
  }


 async function enviarCorreoSubirArchivo(idcorrespondencia){
let sql =`
 (SELECT usuario.nombre as usuario,usuario.correo  FROM correspondencia_C_1.correspondencia_compartidos_usuario
join correspondencia_C_1.usuario on usuario.idusuario =correspondencia_compartidos_usuario.idusuario_receptor 
 where idcorrespondencia=${idcorrespondencia}) union
 (SELECT usuario.nombre as usuario,usuario.correo  FROM correspondencia_C_1.correspondencia_compartidos_usuario
join correspondencia_C_1.usuario on usuario.idusuario =correspondencia_compartidos_usuario.idusuario_emisor 
 where idcorrespondencia=${idcorrespondencia} limit 1)  
`
let usuario = await new Promise((resolve,reject)=>{
    db.query(sql,(error,result,fiel)=>{
        if(error) return resolve({error:error})
        return resolve({resultado:result })
      })
})
console.log(idcorrespondencia)
console.log("Usario a notificar")
console.log(usuario)
if (usuario.resultado) {
    for (let index = 0; index < usuario.resultado.length; index++) {
         console.log(usuario.resultado[index])
         console.log("Enviar Correo")
       /* await correo.enviarCorreo(usuario.resultado[index].usuario,
                                    `Le informamos que hemos adjuntado un archivo a la correspondencia que hemos 
                                    compartido con usted. Por favor, revise el documento a la brevedad y no dude
                                     en contactarnos si tiene alguna pregunta o requiere 
                                     información adicional.`,usuario.resultado[index].correo)
                            .then(() => console.log("Correo enviado con éxito"))
                            .catch((err) => console.error("Fallo en el envío del correo:", err));*/
    }
}
}

async function enviarCorreoAlcompartirDocumento(compartir,idcorrespondencia,usuario){
 

    for (let index = 0; index < compartir.length; index++) {
             console.log(compartir[index])
             console.log("Enviar Correo")
           /* await correo.enviarCorreo(compartir[index].usuario_,
                                        `El usuario ${usuario.nombre} por medio de la presente, le informa que se ha compartido 
                                        con usted la correspondencia  número ${idcorrespondencia}. Le invitamos a revisar su 
                                        contenido a la mayor brevedad, confiando en que la información proporcionada será de su 
                                        interés.Quedamos atentos ante cualquier consulta o requerimiento adicional.`
                                        ,compartir[index].correo)
                                .then(() => console.log("Correo enviado con éxito"))
                                .catch((err) => console.error("Fallo en el envío del correo:", err));*/
        }
    
    }
    function guardarEstado(req,res){
        let p=req.body
        let sql =`
     INSERT INTO correspondencia_C_1.correspondencia_estado
      (nombre_estado, color,default_)
      VALUES ('${p.nombre}', '${p.color}',0);

        `
        db.query(sql,(error1,result,fiel)=>{
            if(error1) return res.status(200).send({error1:error1.sqlMessage})
             
            return res.status(200).send({resultado:"Guardado  con exito" })
          
          })
    }
    function sacarestado(req,res){
        let p=req.body
        let sql =`
           SELECT * FROM correspondencia_C_1.correspondencia_estado order by nombre_estado
        `
        db.query(sql,(error1,result,fiel)=>{
            if(error1) return res.status(200).send({error1:error1.sqlMessage})
            if(result.length===0) return res.status(200).send({mensaje:"No se encontraron estados"})
           
            return res.status(200).send({resultado:result})
          
          })
    }
    function modificarEstado(req,res){
        let p=req.body
        let sql =`
         UPDATE correspondencia_C_1.correspondencia_estado 
         SET nombre_estado = '${p.nombre}', 
         color = '${p.color}' 
         WHERE (idcorrespondencia_estado = '${p.idcorrespondencia_estado}');

        `
        db.query(sql,(error1,result,fiel)=>{
            if(error1) return res.status(200).send({error1:error1.sqlMessage})
             
            return res.status(200).send({resultado:"Modificado  con exito" })
          
          })
    }

    function eliminarEstado(req,res){
        let p=req.body
        let sql =`
   DELETE FROM correspondencia_C_1.correspondencia_estado WHERE (idcorrespondencia_estado = '${p.idcorrespondencia_estado}');

        `
        db.query(sql,(error1,result,fiel)=>{
            if(error1) return res.status(200).send({error1:error1.sqlMessage})
             
            return res.status(200).send({resultado:"Eliminado  con exito" })
          
          })
    }

function agregarDefaultEstado(req,res){
let sql = `
call correspondencia_C_1.agregarDefaultEstado(${req.body.idcorrespondencia_estado});

`
console.log(sql)
db.query(sql,(error1,result,fiel)=>{
    if(error1) return res.status(200).send({error1:error1.sqlMessage})
     
    return res.status(200).send({resultado:"Agregado con exito" })
  
  })
}

 
async function sacarestadoDefault() {
    let sql =`
              SELECT * FROM correspondencia_C_1.correspondencia_estado where default_=1
         `
    let espera  = await new Promise((resolve,reject)=>{
        db.query(sql,(error1,result,fiel)=>{
            if(error1) return resolve({error:"El sistema no cuenta con un estado predeterminado, por lo que no es posible guardar ni compartir la correspondencia."})
            if(result.length===0) return resolve({error:"El sistema no cuenta con un estado predeterminado, por lo que no es posible guardar ni compartir la correspondencia."})
            return resolve({resultado:result })
          })
    })
if (espera.resultado) return {id:espera.resultado[0].idcorrespondencia_estado}
return {error:espera.error} 
    
} 
 async function guardarEstado_control(arregloUsuario,idcorrespondencia,idestado){
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(arregloUsuario)

    if (arregloUsuario.length!==0) {
        for (let index = 0; index < arregloUsuario.length; index++) {
            let sql =`
               INSERT INTO correspondencia_C_1.correspondencia_estado_user 
               (idcorrespondencia,id_correspondencia_estado, idusuario, id_entidad, fecha_sistema) 
               VALUES (${idcorrespondencia},${idestado},'${arregloUsuario[index].idusuario}','${arregloUsuario[index].id_entidad}', now());
            `
            console.log(sql)
            let espera = await new Promise((resolve,reject)=>{
                db.query(sql,(error1,result,fiel)=>{
                    if(error1) return resolve({error:"Error"})
                    return resolve(true)
                  })
            })       
            
        } 
    }
   
}

function cambiarEstadoCorrespondencia(req,res){
    let p=req.body

    let sql =`
    UPDATE correspondencia_C_1.correspondencia_estado_user
     SET id_correspondencia_estado = '${p.estado.idcorrespondencia_estado}', 
     fecha_sistema = now()
      WHERE (idcorrespondencia = '${p.idcorrespondencia}') and (idusuario = '${p.usuario.idusuario}');

    `
    console.log(sql)
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
         
        return res.status(200).send({resultado:"Cambio realizado con exito" })
      
      })
}
function sacarEstadoCorrespondencias(req,res){
    let p =req.body
    let sql = `
    SELECT correspondencia_estado_user.idcorrespondencia,
		correspondencia_estado_user.idusuario,
        correspondencia_estado_user.id_entidad,
        fecha_sistema,idcorrespondencia_estado,
        color,entidad.nombre as depto,
        usuario.nombre as nombre_usuario,
        correspondencia_estado.nombre_estado
 FROM correspondencia_C_1.correspondencia_estado_user
join correspondencia_C_1.correspondencia_estado on correspondencia_estado.idcorrespondencia_estado=correspondencia_estado_user.id_correspondencia_estado
join  correspondencia_C_1.entidad on entidad.identidad = correspondencia_estado_user.id_entidad
join correspondencia_C_1.usuario on usuario.idusuario = correspondencia_estado_user.idusuario
where idcorrespondencia=${p.idcorrespondencia}
    `
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
         
        return res.status(200).send({resultado:result})
      
      })
}


function eliminarArchivosBloquedeLATabla(data) {
    console.log("Elimina archivos bloque")
    data.forEach((element) => {
      eliminarArchivos("Archivos/directorios/",element.dir);
    });
  }

async function eliminarCorrespondencia(req,res){
    let p= req.body
let sql =`
SELECT * FROM correspondencia_C_1.archivos where idcorrespondencia=${p.idcorrespondencia}
`
let archivos = await new Promise((resolve,reject)=>{
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return resolve({error1:error1.sqlMessage})
        return resolve({resultado:result})
     })
})
console.log(archivos.resultado.length)
if(archivos.resultado.length!==0){
    eliminarArchivosBloquedeLATabla(archivos.resultado)
}
let eliminar=`
        delete from correspondencia_C_1.correspondencia where idcorrespondencia=${p.idcorrespondencia}
`
let eliminar_correspondencia = await new Promise((resolve,reject)=>{
    db.query(eliminar,(error1,result,fiel)=>{
        if(error1) return resolve({error1:error1.sqlMessage})
        return resolve({resultado:result})
     })
})
if (eliminar_correspondencia.error)   return res.status(200).send({mensaje:"No se logro eliminar por completo el documento"})

    return res.status(200).send({resultado:"Correspondencia eliminado con exito"})
//eliminarArchivosBloquedeLATabla()
}

function sacarPermisos(req,res){
    let p = req.body
    let sql =`
SELECT 
idusuario_permiso,
    permisos.idpermisos AS idpermiso,
    permisos.nombre AS nombre_permiso,
    usuario_permiso.idusuario,
    IF(usuario_permiso.idusuario IS NULL, false, true) AS autorizado
FROM 
    correspondencia_C_1.permisos
LEFT JOIN 
    correspondencia_C_1.usuario_permiso 
    ON usuario_permiso.idpermisos = permisos.idpermisos
    AND usuario_permiso.idusuario = ${p.idusuario}
ORDER BY 
    permisos.idpermisos;

`
console.log(sql)
db.query(sql,(error1,result,fiel)=>{
    if(error1) return res.status(200).send({error1:error1.sqlMessage})
    return res.status(200).send({resultado:result})
 })

}
function administarrPermisosUsuario(req,res){
    let p = req.body
    console.log(p)
    let sql = ""
    if (p.idusuario_permiso) {
          sql = `
        DELETE FROM correspondencia_C_1.usuario_permiso WHERE (idusuario_permiso = '${p.idusuario_permiso}');
                   `
         
    }else{
          sql =`
        INSERT INTO correspondencia_C_1.usuario_permiso (idusuario, idpermisos) VALUES ('${p.idusuario}', '${p.idpermiso}');

`
    }
    console.log("Permisos")
    console.log(sql)
    db.query(sql,(error1,result,fiel)=>{
        if(error1) return res.status(200).send({error1:error1.sqlMessage})
        return res.status(200).send({resultado:(p.idusuario_permiso?"El permiso han sido eliminado correctamente":"Permiso Agregado con exito") })
     })
  
}
async function resetContrasena(req,res){
    let p=req.body
    let password =await   hashPassword(p.contrasena);
    let sql=`
    UPDATE correspondencia_C_1.usuario
    SET contrasena = '${password}'
    WHERE (idusuario = '${p.idusuario}');
    `
    console.log(sql)
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
 
        return res.status(200).send({resultado:"Contrasena reseteada con exito"})

    })
}
 async function reseteracontrasenaUsuarioFinal(req,res){
    let p = req.body
    console.log(p)
    let traerContrasena=`SELECT contrasena FROM correspondencia_C_1.usuario
    join  correspondencia_C_1.entidad on entidad.identidad =  usuario.id_entidad
     where  usuario='${p.usuario}' `
    console.log(traerContrasena)

  let esperarpeticion = await new Promise((resolve,reject)=>{
    db.query( traerContrasena,(error,resultado,field)=>{
        if(error) return resolve({error:error.sqlMessage})
        if(resultado.length===0) return resolve({mensaje:"Datos no encontrados......"})
        return  resolve({resultado:resultado})

    })
  })
  
  console.log(esperarpeticion)
  if (esperarpeticion.error) return res.status(200).send({error:"Error de db"})
  if (esperarpeticion.mensaje) return res.status(200).send({mensaje:"Credenciales incorrectas 🕵️‍♀️"})
console.log(esperarpeticion.resultado[0].contrasena)

  const match = await verificarContrasena(p.contrasenaAnteriror, esperarpeticion.resultado[0].contrasena);
  console.log(match)
  if(!match) return res.status(200).send({mensaje:"La contraseña anterior no es valida"});

  let password =await   hashPassword(p.contrasena);
    let sql=`
    UPDATE correspondencia_C_1.usuario
    SET contrasena = '${password}'
    WHERE (idusuario = '${p.idusuario}');
    `
    console.log(sql)
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
 
        return res.status(200).send({resultado:"Contrasena reseteada con exito"})

    })

}
 async function reporteVistaMonitoreo_mensual(req,res){
    /**Saca todo los documentos */
    let p= req.body
    let respuesta={
        todo_documento:[],
        doc_entidad:[],
        doc_usuario:[],
        doc_prioridad:[],
        doc_usarios_mas_registro:[],
        doc_total:[]

    }
    let sql1=`
            SELECT * FROM correspondencia_C_1.vista_reporte_monitoreo
           where year(fecha_sistema)=year("${p.mes}-1") and month(fecha_sistema)=month("${p.mes}-1")
           and idorganizacion=${p.hospital.idorganizacion}
         `
         let r1= await new Promise((resolve,reject)=>{
            db.query( sql1,(error,resultado,field)=>{
                if(error) return resolve({resultado:[]})
                if(resultado.length===0) return resolve({resultado:[]})
                return resolve({resultado:resultado})
            })
         })
         console.log(r1.resultado)
        respuesta.todo_documento = r1.resultado


         /**saca la canrtidad de documentos por entidad */
         let sql2 =`
         SELECT entidad, COUNT(*) AS total_por_entidad 
            FROM vista_reporte_monitoreo 
            where year(fecha_sistema)=year("${p.mes}-1") and month(fecha_sistema)=month("${p.mes}-1") and idorganizacion=${p.hospital.idorganizacion}
            GROUP BY entidad 
            ORDER BY total_por_entidad DESC;

         `
         let r2= await new Promise((resolve,reject)=>{
            db.query( sql2,(error,resultado,field)=>{
                if(error) return resolve({resultado:[]})
                if(resultado.length===0) return resolve({resultado:[]})
                return   resolve({resultado:resultado})
            })
         })

        respuesta.doc_entidad = r2.resultado
        console.log(r2.resultado)

/*Por usuario he identidad */
         let sql3 =`
         SELECT entidad,usuario, COUNT(*) AS total_por_usuario 
            FROM vista_reporte_monitoreo 
            where year(fecha_sistema)=year("${p.mes}-1") and month(fecha_sistema)=month("${p.mes}-1") and idorganizacion=${p.hospital.idorganizacion}
            GROUP BY entidad,usuario 
            ORDER BY total_por_usuario DESC;

         `
         let r3= await new Promise((resolve,reject)=>{
            db.query( sql3,(error,resultado,field)=>{
                if(error) return resolve({resultado:[]})
                if(resultado.length===0) return resolve({resultado:[]})
                return resolve({resultado:resultado})
            })
         })
        respuesta.doc_usuario = r3.resultado
         /**Por prioridad */
         let sql4=`
         SELECT prioridad, COUNT(*) AS total_por_prioridad
            FROM vista_reporte_monitoreo
             where year(fecha_sistema)=year("${p.mes}-1") and month(fecha_sistema)=month("${p.mes}-1") and idorganizacion=${p.hospital.idorganizacion}
            GROUP BY prioridad
            ORDER BY FIELD(prioridad,
            (SELECT GROUP_CONCAT(DISTINCT prioridad ORDER BY prioridad SEPARATOR ',') 
            FROM vista_reporte_monitoreo));
         `
         let r4= await new Promise((resolve,reject)=>{
            db.query( sql4,(error,resultado,field)=>{
                if(error) return resolve({resultado:[]})
                if(resultado.length===0) return resolve({resultado:[]})
                return resolve({resultado:resultado})
            })
         })
        respuesta.doc_prioridad = r4.resultado
         /**% usuario con mas registros */
        let sql5=`
           SELECT usuario, COUNT(*) AS total_registros 
            FROM vista_reporte_monitoreo 
             where year(fecha_sistema)=year("${p.mes}-1") and month(fecha_sistema)=month("${p.mes}-1") and idorganizacion=${p.hospital.idorganizacion}
            GROUP BY usuario 
            ORDER BY total_registros DESC 
            LIMIT 10;
        `
        let r5= await new Promise((resolve,reject)=>{
            db.query( sql5,(error,resultado,field)=>{
                if(error) return resolve({resultado:[]})
                if(resultado.length===0) return resolve({resultado:[]})
                return resolve({resultado:resultado})
            })
         })
         respuesta.doc_usarios_mas_registro = r5.resultado
         let sql6=`
         SELECT COUNT(*) AS total_registros FROM vista_reporte_monitoreo
          where year(fecha_sistema)=year("${p.mes}-1") and month(fecha_sistema)=month("${p.mes}-1") and idorganizacion=${p.hospital.idorganizacion}
         `
         let r6= await new Promise((resolve,reject)=>{
            db.query( sql6,(error,resultado,field)=>{
                console.log("###########")
                console.log(resultado[0].total_registros)

                if(error) return resolve({resultado:[]})
                if(resultado[0].total_registros===0) return resolve({resultado:[]})
                return resolve({resultado:resultado})
            })
         })
         respuesta.doc_total = r6.resultado
         console.log(respuesta)
         console.log(estaVacio(respuesta))
         if (estaVacio(respuesta)) {
            return res.status(200).send({mensaje:"No se encontraron datos"})

        } else {
            return res.status(200).send({resultado:respuesta})
        }
       


}
function estaVacio(obj) {
    return Object.keys(obj).length > 0 && Object.values(obj).every(val => 
        Array.isArray(val) && val.length === 0
    );
}
function sacarFuerza(req,res){
    let sql =`SELECT * FROM correspondencia_C_1.expe_fuerza order by  nombre_fuerza`
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron las fuerzas"})
        return res.status(200).send({resultado:resultado})
    })
}
function sacarCategoria(req,res){
    let sql =`SELECT * FROM correspondencia_C_1.expe_categoria where idexpe_fuerza =${req.body.idexpe_fuerza}`
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron categorias"})
        return res.status(200).send({resultado:resultado})
    })
}
function sacarSubCategoria(req,res){
    let sql =`SELECT * FROM correspondencia_C_1.expe_sub_categoria where idexpe_categoria =${req.body.idcategoria}`
    db.query( sql,(error,resultado,field)=>{
        if(error) return res.status(200).send({error:error.sqlMessage})
        if(resultado.length===0) return res.status(200).send({mensaje:"No se encontraron sub categorias"})
        return res.status(200).send({resultado:resultado})
    })
}


async function insertarExpedienteTitular(req,res) {
   let p = req.body
   let sql = `CALL insertar_expe_titular(?, ?, ?, ?, ?,  ?, @mensaje);`
        let data =[
            p.nombre,
            p.apellido,
            p.identidad,
            p.numero_bin,
             p.idexpe_sub_categoria,
            p.numero_serie
          ]
      console.log(sql)
      console.log(data)
         db.query(sql,data,(error,resultado,field)=>{

            db.query(`SELECT @mensaje AS mensaje`, (error2, resultado2) => {
                if (error2) {
                  console.error('Error al obtener mensaje:', error2);
                  return res.status(200).send({ mensaje: 'Error al recuperar el mensaje' });
                }
           
                return res.status(200).send({resultado: resultado2[0].mensaje})
              });
           
        })
       
}

function sacarPersonasExpediente(req,res){
       let sql = `
       SELECT *,(select correspondencia_C_1.expe_contarHijosTitular(idexpe_persona)) as cantidad_hijos 
       FROM correspondencia_C_1.vista_expe_personas_titulares
            where filtro like "%${req.body.filtro}%"
       `
       console.log(sql)
       db.query(sql, (error2, resultado2) => {
        if (error2) return res.status(200).send({ error: 'Error al recuperar el mensaje' });
        if (resultado2.length===0) return res.status(200).send({ mensaje: 'No se encontraron datos' });

         
        return res.status(200).send({resultado: resultado2})
      });
   
}

function guadarExpe_familiar(req,res){
    let p = req.body
    let sql  = `
            call correspondencia_C_1.insertar_expe_familiar_prueba3('${p.nombre}', '${p.apellido}', '${p.identidad}',
            '${p.bin}', '${p.idexpe_sub_categoria}', '${p.idexp_titular}', '${p.serie}',${p.idparentezco});
     `
     console.log(sql)
     db.query(sql, (error2, resultado2) => {
       console.log(resultado2[0][0].mensaje_error)
       if(resultado2[0][0].mensaje_error)   return res.status(200).send({error: resultado2[0][0].mensaje_error})
          return res.status(200).send({resultado: resultado2[0][0].mensaje})

      
      });
    }

function sacarParentezco(req,res){
  let sql =`
  SELECT * FROM correspondencia_C_1.expe_parentezco;
  `
  console.log(sql)
  db.query(sql, (error2, resultado2) => {
      if(error2) return res.status(200).send({error:"Error de conexion"})
      if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})

       return res.status(200).send({resultado: resultado2})

   
   });
   
}

function buscarExpedienteTodos(req,res){
    let sql =`
    SELECT * FROM correspondencia_C_1.vista_expe_todos
    where filtro like "%${req.body.filtro}%"
    `
    console.log(sql)
    db.query(sql, (error2, resultado2) => {
        if(error2) return res.status(200).send({error:"Error de conexion"})
        if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})
  
         return res.status(200).send({resultado: resultado2})
  
     
     });
     
}

function sacarmovimientoPorEntidad(req,res){
    let sql =`
    SELECT * FROM correspondencia_C_1.expe_movimiento_expediente
where id_entidad=${req.body.id_entidad} and hora_recepcion is null
    `
    db.query(sql, (error2, resultado2) => {
        if(error2) return res.status(200).send({error:"Error de conexion"})
        if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})
  
         return res.status(200).send({resultado: resultado2})
  
     
     });
}
function sacarExpedientesPendientes(req,res){
    let sql =`
    select T.*,ex.serie as serie,ex.nombre as persona_nombre,ex.apellido as persona_apellido  from(SELECT idexpe_movimiento_expediente,expe_movimiento_expediente.id_entidad,idusuario_envia,
id_persona_expediente,hora_envia,nombre FROM correspondencia_C_1.expe_movimiento_expediente
join correspondencia_C_1.usuario us on us.idusuario =expe_movimiento_expediente.idusuario_envia
where expe_movimiento_expediente.id_entidad=${req.body.id_entidad} and hora_recepcion is null) as T
join correspondencia_C_1.vista_expe_todos ex on ex.idexpe_persona = T.id_persona_expediente
 
    `
    db.query(sql, (error2, resultado2) => {
        if(error2) return res.status(200).send({error:"Error de conexion"})
        if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})
  
         return res.status(200).send({resultado: resultado2})
  
     
     });
}

function sacarExpedientesRecibidos(req,res){
    let sql =`
      select D.*,ur.nombre as usuario_Recibe from(select T.*,ex.serie as serie,ex.nombre as persona_nombre,ex.apellido as persona_apellido
  from(SELECT idexpe_movimiento_expediente,expe_movimiento_expediente.id_entidad,idusuario_envia,
    id_persona_expediente,hora_envia,nombre,idusuario_recibe,hora_recepcion FROM correspondencia_C_1.expe_movimiento_expediente
    join correspondencia_C_1.usuario us on us.idusuario =expe_movimiento_expediente.idusuario_envia
    where expe_movimiento_expediente.id_entidad=${req.body.id_entidad} and hora_recepcion is not null and hora_ultima_estancia is  null) as T
    join correspondencia_C_1.vista_expe_todos ex on ex.idexpe_persona = T.id_persona_expediente) as D
    join correspondencia_C_1.usuario ur on ur.idusuario=D.idusuario_recibe
    
 
 
    `
    db.query(sql, (error2, resultado2) => {
        if(error2) return res.status(200).send({error:"Error de conexion"})
        if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})
  
         return res.status(200).send({resultado: resultado2})
  
     
     });
}

function aceptarRecibidosPendiente(req,res){
    let sql =`
 UPDATE correspondencia_C_1.expe_movimiento_expediente
 SET idusuario_recibe = '${req.body.idusuario}',
  hora_recepcion = now()
   WHERE (idexpe_movimiento_expediente = '${req.body.idexpe_movimiento_expediente}');
    `
    console.log()
    db.query(sql, (error2, resultado2) => {
        if(error2) return res.status(200).send({error:"Error de conexion"})
        if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})
  
            return res.status(200).send({resultado:"Se recibio conforme"})
     
     });
}

function enviarExpediente(req,res){
    let p = req.body
 
    let sql =`
    call correspondencia_C_1.insertar_expe_enviar(${p.id_entidad_}, ${p.idusuario_envia_}, ${p.id_persona_expediente_}, 
    'Enviado', ${p.idexpe_movimiento_expediente_}, @mensaje);
 
    `
    db.query(sql, (error2, resultado2) => {
    
     
            db.query(`SELECT @mensaje AS mensaje`, (error2, resultado2) => {
                if (error2) {
                  console.error('Error al obtener mensaje:', error2);
                  return res.status(200).send({ mensaje: 'Error al recuperar el mensaje' });
                }
           
                return res.status(200).send({resultado: resultado2[0].mensaje})
              });
 
       
       });
}


function agregarUnuevoExpedienteExistente(req,res){
    let p  = req.body
 
    let sql =`
        CALL insertar_expe_movi_nuevo(${p.id_entidad_}, ${p.idusuario_envia_},${p.id_persona_expediente_}, '${p.observacion_}', @mensaje);
     `
     db.query(sql, (error2, resultado2) => {
      
        db.query(`SELECT @mensaje AS mensaje`, (error2, resultado2) => {
            if (error2) {
              console.error('Error al obtener mensaje:', error2);
              return res.status(200).send({ mensaje: 'Error al recuperar el mensaje' });
            }
       
            return res.status(200).send({resultado: resultado2[0].mensaje})
          });

   
   });
}

function buscarDondeEstaUnExpediente(req,res){
    let sql = `
    SELECT ent.nombre as depto,hora_envia,hora_recepcion,hora_ultima_estancia,id_persona_expediente,
todo.nombre as nombreAfiliado,todo.apellido as apellidoAfiliado,todo.filtro,todo.identidad,todo.tipo ,todo.serie
FROM correspondencia_C_1.expe_movimiento_expediente
join correspondencia_C_1.entidad ent on ent.identidad =  expe_movimiento_expediente.id_entidad
join correspondencia_C_1.vista_expe_todos todo on todo.idexpe_persona =  expe_movimiento_expediente.id_persona_expediente
where filtro like "%${req.body.filtro}%" and (hora_recepcion is null or hora_ultima_estancia is null)
    `
     
    db.query(sql, (error2, resultado2) => {
        if (error2) {
          console.error('Error al obtener mensaje:', error2);
          return res.status(200).send({ mensaje: error2.sqlMessage });
        }
      if(resultado2.length===0) return res.status(200).send({mensaje: "No se encontraron datos"})
        return res.status(200).send({resultado: resultado2 })
      });


}

function modificarPersonaExpediente(req,res){
    let p = req.body
    console.log(p)
    let sql = `
    call correspondencia_C_1.modificar_expe_titular('${p.nombre}', '${p.apellido}', '${p.identidad}', '${p.numero_bin}', 
    '${p.idexpe_persona}', ${p.idexpe_sub_categoria.idexpe_sub_categoria},
     '${p.serie}','${p.idexpe_sub_categoria.codigo}-${p.serie}','${p.datos_anteriores.serie}',@mensaje);
     `

 console.log(sql)
   db.query(sql, (error2, resultado2) => {
        if (error2) {
          console.error('Error al obtener mensaje:', error2);
          return res.status(200).send({ mensaje: error2.sqlMessage });
        }
        db.query(`SELECT @mensaje AS mensaje`, (error2, resultado2) => {
            if (error2) {
              console.error('Error al obtener mensaje:', error2);
              return res.status(200).send({ mensaje: 'Error al recuperar el mensaje' });
            }
       
            return res.status(200).send({resultado: resultado2[0].mensaje})
          });
      });
  
}
function sacarinformacionSiEsTitular(req,res){
    let sql = `
  
    SELECT * FROM correspondencia_C_1.vista_expe_personas_titulares where idexpe_persona =${req.body.idexpe_persona}
    `
    console.log(sql)
    db.query(sql, (error2, resultado2) => {
        if (error2) {
 
          return res.status(200).send({error:error2.sqlMessage})
        }
        if (resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron datos"})  
        return res.status(200).send({resultado:resultado2})  

      });
}

function ModificarDatosFamiliares(req,res){
    let p = req.body
let sql=`
UPDATE correspondencia_C_1.expe_persona 
    SET nombre = '${p.nombre}',
    apellido = '${p.apellido}', 
    identidad = '${p.identidad}',
    numero_bin = '${p.bin}'
    WHERE (idexpe_persona = '${p.idexpe_persona}');

`
console.log(sql)
db.query(sql, (error2, resultado2) => {
    if (error2) {
      return res.status(200).send({error:error2.sqlMessage})
    }
 
    return res.status(200).send({resultado:"Actualizado con exito"})  

  });
}
function aliminarVinculo(req,res){
    let p = req.body
    let sql = `
        DELETE FROM correspondencia_C_1.expe_titular_familiar 
        WHERE (idexpe_titular = '${p.idexpe_titular}') and (idexpe_familiar = '${p.idexpe_familiar}');
    `
    console.log(sql)
db.query(sql, (error2, resultado2) => {
    if (error2) {
      return res.status(200).send({error:error2.sqlMessage})
    }
 
    return res.status(200).send({resultado:"Eliminado con exito"})  

  });
}

function sacarTipoVinculoPrFamiliar(req,res){
    let p = req.body
    let sql  =`SELECT idexpe_titular,idexpe_familiar,nombre,apellido,identidad,serie,nombre_parentezco FROM correspondencia_C_1.expe_titular_familiar
join  correspondencia_C_1.expe_persona per on per.idexpe_persona =  expe_titular_familiar.idexpe_titular
join correspondencia_C_1.expe_parentezco pa on pa.idexpe_parentezco=expe_titular_familiar.idparentezco
where  idexpe_familiar= ${p.idexpe_persona}`
console.log(sql)
db.query(sql, (error2, resultado2) => {
    if (error2) {
      return res.status(200).send({error:error2.sqlMessage})
    }
    if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron familiares"})
 console.log(resultado2)
    return res.status(200).send({resultado:resultado2})  

  });
}

function sacarHistoricoMovimiento(req,res){
    let sql =`
    select D.*,us.nombre as usuario_recibio from(SELECT  hora_envia,hora_recepcion,hora_ultima_estancia,id_persona_expediente,
ent.nombre as departamento,idusuario_recibe,idusuario_envia,us.nombre as usaurio_envia FROM correspondencia_C_1.expe_movimiento_expediente
join  correspondencia_C_1.entidad ent on ent.identidad = expe_movimiento_expediente.id_entidad
join correspondencia_C_1.usuario us on us.idusuario = expe_movimiento_expediente.idusuario_envia
where id_persona_expediente =  ${req.body.id_persona_expediente} ) as D
left join correspondencia_C_1.usuario us on us.idusuario = D.idusuario_recibe
 order by D.hora_envia desc
 limit 100
    
    `
    console.log(sql)
db.query(sql, (error2, resultado2) => {
    if (error2) {
      return res.status(200).send({error:error2.sqlMessage})
    }
    if(resultado2.length===0) return res.status(200).send({mensaje:"No se encontraron familiares"})
 
    return res.status(200).send({resultado:resultado2})  

  });
}

function sacarOtrosOrigenes(req,res){
       let sqlOtrosOrigenes = `SELECT * from correspondencia_C_1.correspondencias_mas_origenes
            join correspondencia_C_1.origenes on origenes.idorigenes = correspondencias_mas_origenes.idorigen
            where idcorrespondencia=${req.body.idcorrespondencia}`
                console.log(sqlOtrosOrigenes)
db.query(sqlOtrosOrigenes, (error2, resultado2) => {
    if (error2)    return res.status(200).send({error:error2.sqlMessage})
    if (resultado2.length===0)    return res.status(200).send({resultado:[]})

    
    return res.status(200).send({resultado:resultado2})  

  });
 
}

function modificarTexto(req,res){
    let sql = `
     UPDATE correspondencia_C_1.correspondencia 
     SET texto = '${req.body.texto}' WHERE (idcorrespondencia = '${req.body.idcorrespondencia}');


    `
    db.query(sql, (error2, resultado2) => {
    if (error2)    return res.status(200).send({error:error2.sqlMessage})
  
    
    return res.status(200).send({resultado:"Actualizado con exito"})  

  });
}

function sacarDisposicionesID(req,res){
    let sql = `
    SELECT * FROM correspondencia_C_1.correspondencia_disposicion where idcorrespondencia=${req.body.idcorrespondencia}
    `
     db.query(sql, (error2, resultado2) => {
    if (error2)    return res.status(200).send({error:error2.sqlMessage})
    if (resultado2.length===0)    return res.status(200).send({mensaje:"No hay disposiciones"})
 
    
    return res.status(200).send({resultado:resultado2})  

  });
}
function guardarDisposicionModificada(req, res) {

  const datos = req.body.arreglo;

  if (!Array.isArray(datos) || datos.length === 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No hay datos para actualizar'
    });
  }

  let caseSql = '';
  const ids = [];
  const values = [];

  datos.forEach(item => {
    caseSql += ' WHEN ? THEN ? ';
    values.push(item.idcorrespondencia_disposicion, item.texto);
    ids.push(item.idcorrespondencia_disposicion);
  });

  const placeholders = ids.map(() => '?').join(',');

  const sql = `
    UPDATE correspondencia_C_1.correspondencia_disposicion
    SET texto = CASE idcorrespondencia_disposicion
      ${caseSql}
    END
    WHERE idcorrespondencia_disposicion IN (${placeholders})
  `;

  const finalValues = [...values, ...ids];

  db.query(sql, finalValues, (error, result) => {

    if (error) {
      console.error('Error en guardarDisposicionModificada:', error);
      return res.status(200).json({
        ok: false,
        mensaje: 'Error al actualizar disposiciones'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(200).json({
        ok: false,
        mensaje: 'No se actualizaron registros'
      });
    }

    return res.json({
      ok: true,
      resultado: 'Textos actualizados correctamente',
      filas_afectadas: result.affectedRows,
      arreglo:datos
    });

  });
}

 

const obtenerAlertasCorrespondencia = async (req,res) => {

    try {
        const sql = `
           SELECT
            c.idcorrespondencia,
            c.expediente,
            c.fecha,
            c.fecha_limite,
            c.texto
        FROM correspondencia_C_1.correspondencia c
        WHERE DATE(c.fecha_limite)
            BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                AND DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        AND c.identidad = ${req.body.identidad}
        ORDER BY c.fecha_limite ASC;
        `;
console.log("Sacando pendientes")
        console.log(sql)
         db.query(sql, (error2, resultado2) => {
            if (error2)    return res.status(200).send({error:error2.sqlMessage})
            if (resultado2.length===0)    return res.status(200).send({mensaje:"No hay disposiciones"})
             
            return res.status(200).send({resultado:resultado2})  

        });
    
    } catch (error) {
        throw error;
    }

}

 
module.exports = {
    prueba,
    crearOrganizacion,
    agregarEntidad,
    eliminarOrganizacion,
    modificarOrganizacion,
    eliminarEntidad,
    modificarEntidad,
    sacarOrganizacion,
    sacarEntidad,
    sacarTipoEntidad,
    sacarPadresEntidad,
    guadarEntidad,
    sacarEntidades_X_Organizacion,
    agregarFirmas,
    sacarFirmas,
    eliminarFirmas,
    modificarFirmas,
    sacarorigen,
    sacarClasificacion,
    sacarTipoCorrespondencia,
    sacarNivelAtencion,
    guardarTiketCorrespondencia,
     guardarUsuarios,
     sacarTodoUsuario,
     eliminarUsuario,
     modificarUsuario,
     loguiarse,
     buscarUsuario,
     sacarCorrespondenciaPorUsuario,
     sacarArchivosPDF,
     sacarArchivosCorrespondencia,
     agregarComentarioDocumento,
     sacarcomentarioArchivo,
     cargarMasArchivoCorrespondecia,
     agregarDisposicion,
     sacarDisposicion,
     eliminarArchivoCorrespondencia,
     sacarUsuarioCompartidoCorrespondencia,
     compartirMasUsuario,
     sacarCorrespondeciasCompartidasUsuario,
     guardarOrigenes,
     modificarOrigenes,
     eliminarOrigenes,

     guardarClasificacion,
     modificarClasificacion,
     EliminarClasificacion,

     guardarPrioridad,
     EliminarPrioridad,
     ModificarPrioridad,

     guardarTipo,
     eliminarTipo,
     modificarTipo,

     guardarEstado,
     sacarestado,
     modificarEstado,
     eliminarEstado,
     agregarDefaultEstado,
     cambiarEstadoCorrespondencia,
     sacarEstadoCorrespondencias,
     eliminarCorrespondencia,
     sacarPermisos,
     administarrPermisosUsuario,
     resetContrasena,
     reseteracontrasenaUsuarioFinal,
     reporteVistaMonitoreo_mensual,
     //Aqui todo lo de expediente
     sacarFuerza,
     sacarCategoria,
     sacarSubCategoria,
     insertarExpedienteTitular,
     sacarPersonasExpediente,
     guadarExpe_familiar,
     sacarParentezco,
     buscarExpedienteTodos,
     sacarmovimientoPorEntidad,
     sacarExpedientesPendientes,
     sacarExpedientesRecibidos,
     aceptarRecibidosPendiente,
     enviarExpediente,
     agregarUnuevoExpedienteExistente,
     buscarDondeEstaUnExpediente,
     modificarPersonaExpediente,
     sacarinformacionSiEsTitular,
     ModificarDatosFamiliares,
     aliminarVinculo,
     sacarTipoVinculoPrFamiliar,
     sacarHistoricoMovimiento,
     sacarOtrosOrigenes,
     modificarTexto,
     sacarDisposicionesID,
     guardarDisposicionModificada,
     obtenerAlertasCorrespondencia



    }
