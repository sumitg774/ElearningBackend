// routes/userRoutes.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { registerUser, loginUser } from '../controllers/controller';
import Course from '../models/Course';
import Lesson from '../models/Lesson';

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

// User Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Get All Courses
router.get('/courses', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Add a New Course (With Image Upload)
router.post('/courses/add', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, instructor } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newCourse = new Course({ title, instructor, image: imagePath });
    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully!', course: newCourse });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
});

// Get Course by ID (Including Lessons)
router.get('/courses/:courseId', async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Fetch lessons using courseId
    const lessons = await Lesson.find({ courseId: course._id });
    res.json({ course, lessons });
  } catch (error: any) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Error fetching course details' });
  }
});

// Add a Lesson to a Course
router.post('/courses/:id/lessons', async (req: Request, res: Response) => {
  try {
    const { title, content, videoUrl } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newLesson = new Lesson({ title, content, videoUrl, courseId });
    await newLesson.save();

    res.status(201).json({ message: 'Lesson added successfully!', lesson: newLesson });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding lesson', error: error.message });
  }
});

export default router;
