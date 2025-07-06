import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get("/leaderboard", async (req, res) => {
  try {
    const leaders = await prisma.user.findMany({
      orderBy: [
        { points: 'desc' },
        { streak: 'desc' }
      ],
      select: {
        id: true,
        name: true,      // Use 'name' if your frontend expects 'name'
        points: true,
        streak: true
      }
    });
    res.json(leaders);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Leaderboard fetch failed" });
  }
});

export default router;