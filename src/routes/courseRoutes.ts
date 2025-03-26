// src/routes/courseRoutes.ts
import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { getAllCourses, addCourse, getCourseById } from '../controllers/courseController';
import { addLessonToCourse } from '../controllers/lessonController';
import { authMiddleware } from '../controllers/authMiddleware';

const router = express.Router();

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, path.join(__dirname, '../../src/uploads'));
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Course endpoints
router.get('/courses', authMiddleware(['admin', 'instructor', 'learner']), getAllCourses);
router.post('/courses/add', authMiddleware(['admin', 'instructor']), upload.single('image'), addCourse);
router.get('/courses/:courseId', authMiddleware(['admin', 'instructor', 'learner']), getCourseById);

// Lesson endpoint (Only the course instructor or admin can add lessons)
router.post('/courses/:id/lessons', authMiddleware(['admin', 'instructor']), addLessonToCourse);

export default router;
