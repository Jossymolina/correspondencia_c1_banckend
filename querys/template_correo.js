function enviar_aviso(usuario,texto){
    return `
    <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Notificación</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="width: 600px; background: #ffffff; 
                border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <tr>
                    <td style="background: #007bff; color: #ffffff; 
                    padding: 20px; font-size: 24px; font-weight: bold; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    📢 ¡Nueva Notificación!
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; text-align: center; font-size: 16px; color: #333;">
                    <p>Hola <strong>${usuario}</strong>,</p>
                    <p>${texto}</p>
                    <p style="background: #f8f9fa; padding: 10px; border-radius: 5px;
                     font-style: italic;">"Control de notificaciones."</p>
                   <!-- <p>Puedes revisar más detalles haciendo clic en el siguiente botón:</p>
                    <a href="https://tusitio.com" style="display: inline-block; background: #007bff; 
                    // color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; 
                    // font-weight: bold;">Ver Notificación</a>-->
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; text-align: center; font-size: 14px; color: #666;">
                    <p>Si no esperabas este correo, ignóralo.</p>
                    <p>&copy; 2025 HM - Todos los derechos reservados</p>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>

    `
}

module.exports={
    enviar_aviso
}