import { verifyToken } from './jwt.js';
import { config } from '../config.js';

export function requireAuth(req, res, next) {
  const token = req.cookies[config.cookie.name];
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

export function optionalAuth(req, res, next) {
  const token = req.cookies[config.cookie.name];
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {}
  }
  next();
}