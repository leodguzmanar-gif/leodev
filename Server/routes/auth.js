import { Router } from 'express';
import passport from 'passport';
import { prisma } from '../db.js';
import { signToken } from '../auth/jwt.js';
import { setAuthCookie, clearAuthCookie } from '../auth/cookies.js';
import { requireAuth, optionalAuth } from '../auth/middleware.js';
import { hashPassword, verifyPassword, createResetToken, consumeResetToken } from '../auth/password.js';
import { sendResetEmail } from '../mail/send.js';
import { config } from '../config.js';

const router = Router();

// ─── Registro ───
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return res.status(409).json({ error: 'Usuario o email ya existe' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ─── Login ───
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    res.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ─── Logout ───
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// ─── Me ───
router.get('/me', optionalAuth, async (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    clearAuthCookie(res);
    return res.json({ user: null });
  }
  res.json({
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
});

// ─── Olvidé mi contraseña ───
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Siempre responder OK para no revelar si el email existe
    if (user) {
      const token = await createResetToken(user.id);
      const resetLink = `${config.frontendUrl}/reset-password?token=${token}`;
      await sendResetEmail(email, resetLink);
    }

    res.json({ ok: true, message: 'Si el email existe, recibirás instrucciones.' });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ─── Reset password ───
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    const user = await consumeResetToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    res.json({ ok: true, message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ─── OAuth Google ───
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${config.frontendUrl}/login?error=oauth` }),
  (req, res) => {
    const token = signToken({ id: req.user.id, role: req.user.role });
    setAuthCookie(res, token);
    res.redirect(`${config.frontendUrl}/`);
  }
);

// ─── OAuth GitHub ───
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${config.frontendUrl}/login?error=oauth` }),
  (req, res) => {
    const token = signToken({ id: req.user.id, role: req.user.role });
    setAuthCookie(res, token);
    res.redirect(`${config.frontendUrl}/`);
  }
);

export default router;