import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Server } from "socket.io";
import http from 'http';

dotenv.config();
import './utils/passport.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import initializeSockets from './sockets/index.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/', (req, res) => res.send('API running'));

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true }
});
app.set('io', io);

initializeSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);