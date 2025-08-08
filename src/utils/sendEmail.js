
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmailWithQR = async (email, qrCodeDataURL, name) => {
  // Configuración explícita para SMTP de Gmail
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Host SMTP de Gmail
    port: 465,             // Puerto seguro para SMTP (SSL/TLS)
    secure: true,          // Usa SSL/TLS (true para puerto 465)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define un Content ID para tu imagen QR
  const qrCid = 'qr-code-image@uniqueid'; // Este ID debe ser único por imagen en el mismo email

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "¡Bienvenida a MamisFitness! Tu Código QR de Acceso 🎉",
    html: `
      <p>Hola ${name},</p>
      <p>¡Gracias por registrarte en MamisFitness!</p>
      <p>Aquí tienes tu código QR personal para acceder a nuestras instalaciones:</p>
      <img src="cid:${qrCid}" alt="Código QR de Acceso" style="max-width: 300px; height: auto; display: block; margin: 20px auto;">
      <p>Solo presenta este QR en la entrada para escanearlo.</p>
      <p>¡Esperamos verte pronto!</p>
      <p>Saludos cordiales,</p>
      <p>El equipo de MamisFitness</p>
    `,
    // ¡Aquí está la clave! Adjuntamos la imagen con su Content ID
    attachments: [
      {
        filename: 'codigo_qr.png', // Nombre del archivo cuando el usuario lo descargue
        content: qrCodeDataURL.split('base64,')[1], // Solo la parte base64 de la Data URL
        encoding: 'base64', // Indica que el contenido está en base64
        cid: qrCid, // El Content ID que usaste en el HTML
        contentType: 'image/png' // Tipo de contenido de la imagen
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado a ${email}`);
  } catch (error) {
    console.error(`Error al enviar el email a ${email}:`, error);
    // Añadir un mensaje más útil si el error es de autenticación o conexión
    if (error.responseCode === 535) {
      throw new Error('Error de autenticación con el servidor de correo. Verifica EMAIL_USER y EMAIL_PASS.');
    } else {
      throw new Error('No se pudo enviar el email con el código QR. Revisa la configuración del servidor de correo.');
    }
  }
};