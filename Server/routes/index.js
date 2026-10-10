import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import { config } from '../src/config.js';
import '../src/auth/oauth.js'; // Inicializa estrategias Passport

import authRoutes from './auth.js';
import laboratoryRoutes from './laboratory.js';
import projectsRoutes from './projects.js';

const app = express();

// ─── Middlewares ───
app.use(cors(config.cors));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ─── Health check (Render lo usa) ───
app.get('/health', (req, res) => res.json({ ok: true }));

// ─── Rutas ───
app.use('/api/auth', authRoutes);
app.use('/api/laboratory', laboratoryRoutes);
app.use('/api/projects', projectsRoutes);

// ─── Arrancar ───
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
