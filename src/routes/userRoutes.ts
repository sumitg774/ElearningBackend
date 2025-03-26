// src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser } from '../controllers/user';
import { authMiddleware } from '../controllers/authMiddleware';

const router = express.Router();

// User Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example protected routes (for testing role-based access)
router.get('/admin', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});
router.get('/instructor', authMiddleware(['instructor']), (req, res) => {
  res.json({ message: 'Welcome Instructor!' });
});
router.get('/learner', authMiddleware(['learner']), (req, res) => {
  res.json({ message: 'Welcome Learner!' });
});

export default router;
