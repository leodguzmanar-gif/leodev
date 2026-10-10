import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

router.get('/', async (req, res) => {
  const items = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json({ items });
});

router.get('/:slug', async (req, res) => {
  const item = await prisma.project.findUnique({
    where: { slug: req.params.slug },
  });
  if (!item) return res.status(404).json({ error: 'No encontrado' });
  res.json({ item });
});

router.post('/', requireAuth, async (req, res) => {
  const { title, slug, description, category, year, stack, status, links } = req.body;
  const item = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      category,
      year,
      stack: stack || [],
      status: status || 'active',
      links,
      authorId: req.user.id,
    },
  });
  res.status(201).json({ item });
});

router.put('/:id', requireAuth, async (req, res) => {
  const { title, slug, description, category, year, stack, status, links } = req.body;
  const item = await prisma.project.update({
    where: { id: req.params.id },
    data: { title, slug, description, category, year, stack, status, links },
  });
  res.json({ item });
});

router.delete('/:id', requireAuth, async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;