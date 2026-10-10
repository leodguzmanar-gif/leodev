import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

// Público: listar
router.get('/', async (req, res) => {
  const items = await prisma.laboratory.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json({ items });
});

// Público: detalle por slug
router.get('/:slug', async (req, res) => {
  const item = await prisma.laboratory.findUnique({
    where: { slug: req.params.slug },
  });
  if (!item) return res.status(404).json({ error: 'No encontrado' });
  res.json({ item });
});

// Protegido: crear
router.post('/', requireAuth, async (req, res) => {
  const { title, slug, description, content, status, tags } = req.body;
  const item = await prisma.laboratory.create({
    data: {
      title,
      slug,
      description,
      content,
      status: status || 'active',
      tags: tags || [],
      authorId: req.user.id,
    },
  });
  res.status(201).json({ item });
});

// Protegido: editar
router.put('/:id', requireAuth, async (req, res) => {
  const { title, slug, description, content, status, tags } = req.body;
  const item = await prisma.laboratory.update({
    where: { id: req.params.id },
    data: { title, slug, description, content, status, tags },
  });
  res.json({ item });
});

// Protegido: borrar
router.delete('/:id', requireAuth, async (req, res) => {
  await prisma.laboratory.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;