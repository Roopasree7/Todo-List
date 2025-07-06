import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GOOGLE
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (_, __, profile, done) => {
  const email = profile.emails && profile.emails[0]?.value;
  if (!email) return done(new Error("No email found in Google profile"));

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: profile.displayName,
        email,
        avatarUrl: profile.photos[0]?.value,
        googleId: profile.id
      }
    });
  }
  done(null, user);
}));

// GITHUB
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/auth/github/callback",
  scope: ['user:email']
}, async (_, __, profile, done) => {
  const email = (profile.emails && profile.emails[0]?.value) || `${profile.username}@github.com`;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: profile.username,
        email,
        avatarUrl: profile.photos[0]?.value,
        githubId: profile.id
      }
    });
  }
  done(null, user);
}));

// SESSION
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});
