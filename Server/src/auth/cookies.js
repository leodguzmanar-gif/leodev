import { config } from '../config.js';

export function setAuthCookie(res, token) {
  res.cookie(config.cookie.name, token, {
    httpOnly: true,
    secure: config.cookie.secure,      // true en producción (HTTPS)
    sameSite: config.cookie.sameSite,  // 'None' para跨域 con HTTPS
    domain: config.cookie.domain,      // ej: '.onrender.com'
    maxAge: config.cookie.maxAge,
    path: '/',
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(config.cookie.name, {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    domain: config.cookie.domain,
    path: '/',
  });
}