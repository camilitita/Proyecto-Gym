import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../config/db.js';
import transporter from '../config/email.js';
import Swal from 'sweetalert2';

const router = Router();

// Endpoint de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos.' });
  }

  try {
    const userQuery = 'SELECT password, role FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acceso no autorizado para este rol.' });
    }

    res.status(200).json({ success: true, message: 'Inicio de sesión exitoso.' });

  } catch (error) {
    console.error('Error en el endpoint de login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

// Enviar email de restablecimiento
router.post('/admin/send-reset-email', async (req, res) => {
  try {
    const adminEmail = 'camicas0118@gmail.com';
    const token = crypto.randomBytes(20).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1 hora

    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3 AND role = $4',
      [token, expiration, adminEmail, 'admin']
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'Restablecimiento de contraseña',
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Correo enviado con el enlace de restablecimiento.' });

  } catch (err) {
    console.error('Error enviando el correo:', err);
    res.status(500).json({ success: false, message: 'Error enviando el correo.' });
  }
});


// Restablecer contraseña del administrador
router.post('/admin/reset-password', async (req, res) => {
  const { token, password } = req.body;

  console.log('🔐 Token recibido del frontend:', token);
  console.log('🔑 Nueva contraseña recibida:', password);
  console.log('📬 Datos recibidos en req.body:', req.body);

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'El token y la nueva contraseña son requeridos.' });
  }

  try {
    const adminEmail = 'camicas0118@gmail.com';

    // Verificamos el token actual del admin
    const dbResult = await pool.query(
      'SELECT reset_password_token FROM users WHERE role = $1 AND email = $2',
      ['admin', adminEmail]
    );
    const tokenEnBD = dbResult.rows[0]?.reset_password_token;

    console.log('📦 Token almacenado en la base de datos:', tokenEnBD);
    console.log('¿Coinciden?', token === tokenEnBD);

    // Obtenemos al usuario por token (sin validar expiración todavía)
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_password_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'El token es inválido.' });
    }

    const user = result.rows[0];

    // Validamos expiración manualmente con JS
    console.log('⏰ Expira el token:', user.reset_password_expires);
    console.log('🕒 Fecha actual del servidor:', new Date());

    if (new Date(user.reset_password_expires) < new Date()) {
      return res.status(400).json({ success: false, message: 'El token ha expirado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users 
      SET password = $1, reset_password_token = NULL, reset_password_expires = NULL 
      WHERE id = $2`,
      [hashedPassword, user.id]
    );

    console.log('✅ Contraseña actualizada correctamente');
    res.status(200).json({ success: true, message: 'Contraseña restablecida exitosamente.' });

  } catch (error) {
    console.error('❌ Error al restablecer la contraseña:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});




export default router;
