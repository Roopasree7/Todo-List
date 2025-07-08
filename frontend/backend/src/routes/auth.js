import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  });

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  });

// Email/password signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: "Email already used" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash }
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: "Signup successful" });
});

router.post('/logout', async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    if (req.session) {
      req.session.destroy(() => {});
    }

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // ✅ Respond with success
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

export default router;
