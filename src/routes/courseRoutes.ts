// src/routes/courseRoutes.ts
import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { getAllCourses, addCourse, getCourseById } from '../controllers/course';
import { addLessonToCourse } from '../controllers/lesson';
import { authMiddleware } from '../controllers/authMiddleware';

const router = express.Router();

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Adjust the path according to your project structure.
    cb(null, path.join(__dirname, '../../src/uploads'));
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Course endpoints
router.get('/courses', getAllCourses);
router.post('/courses/add',authMiddleware(['admin']), upload.single('image'), addCourse);
router.get('/courses/:courseId', getCourseById);

// Lesson endpoint (Add a Lesson to a Course)
router.post('/courses/:id/lessons', addLessonToCourse);

export default router;
