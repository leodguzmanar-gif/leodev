import nodemailer from 'nodemailer';
import { config } from '../config.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false, // 587 usa STARTTLS
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export async function sendResetEmail(to, resetLink) {
  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject: 'Restablecer contraseña',
    html: `
      <h2>Recupera tu contraseña</h2>
      <p>Haz clic en el enlace para restablecerla. Expira en 1 hora.</p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Si no solicitaste esto, ignora este email.</p>
    `,
  });
}