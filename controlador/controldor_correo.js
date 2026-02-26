"use stric"
const { query } = require("express")
var db= require("../db/db")
 var templates = require("../querys/template_correo")
const nodemailer = require("nodemailer");

 

async function enviarCorreo(usuario, texto, correo) {
  console.log("########################################################3")
  console.log("correo: "+correo)
  try {
    // Configurar el transporte
    const transporter = nodemailer.createTransport({
      service: "smtp",
      host:"webmail.hospitalmilitar.hn",
        auth: {
          user: "notificaciones@hospitalmilitar.hn",
          pass: "AuRzXFFp8v5S*",
        },
      });

    // Opciones del correo

    const mailOptions = {
        from: "notificaciones@hospitalmilitar.hn",
        to: correo,
        subject: "Notificacion Sistema de Correspondencia",
        html:templates.enviar_aviso(usuario,texto),
      };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

       console.log("Correo enviado:", info.response);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}
 

module.exports={
    enviarCorreo
}
 
