import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.use(cookieParser());

// Auth middleware
const auth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.error("Auth error:", e);
    res.status(401).json({ message: "Invalid token" });
  }
};

router.use(auth);

/**
 * GET /api/tasks
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id }, // ✅ corrected from ownerId
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/tasks
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'pending',
        userId: req.user.id, // ✅ corrected from ownerId
      }
    });

    req.app?.get('io')?.to(req.user.id.toString())?.emit('task-updated', task);
    res.status(201).json(task);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * PUT /api/tasks/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, dueDate } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id: taskId },
      data
    });

    req.app?.get('io')?.to(req.user.id.toString())?.emit('task-updated', task);
    res.json(task);
  } catch (err) {
    console.error(`PUT /api/tasks/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * DELETE /api/tasks/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await prisma.task.delete({ where: { id: taskId } });

    req.app?.get('io')?.to(req.user.id.toString())?.emit('task-updated', { id: taskId, deleted: true });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(`DELETE /api/tasks/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/tasks/leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { tasks: true },
    });

    const leaderboard = users.map(user => ({
      name: user.name,
      points: user.tasks?.length || 0,
      streak: user.streak || 0
    })).sort((a, b) => b.points - a.points);

    res.json(leaderboard);
  } catch (err) {
    console.error("GET /api/tasks/leaderboard error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
