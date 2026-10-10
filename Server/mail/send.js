import { google } from 'googleapis';
import { config } from '../config.js';

const oauth2Client = new google.auth.OAuth2(
  config.gmail.clientId,
  config.gmail.clientSecret,
  'https://developers.google.com/oauthplayground' // redirect URI usado al generar el token
);

oauth2Client.setCredentials({
  refresh_token: config.gmail.refreshToken,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

function buildRawMessage({ from, to, subject, html }) {
  const boundary = 'boundary_' + Date.now();
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(html).toString('base64'),
    `--${boundary}--`,
  ].join('\r\n');

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sendResetEmail(to, resetLink) {
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #15803d;">Recupera tu contraseña</h2>
      <p>Haz clic en el botón para restablecer tu contraseña. El enlace expira en 1 hora.</p>
      <p style="margin: 24px 0;">
        <a href="${resetLink}"
           style="display: inline-block; padding: 12px 24px; background: #15803d;
                  color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Restablecer contraseña
        </a>
      </p>
      <p style="color: #666; font-size: 13px;">
        Si no solicitaste este cambio, ignora este correo.
      </p>
    </div>
  `;

  const raw = buildRawMessage({
    from: config.gmail.user,
    to,
    subject: 'Restablecer contraseña — Leodev',
    html,
  });

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });

  return result.data;
}
