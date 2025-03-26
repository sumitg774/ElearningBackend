// src/controllers/courseController.ts
import { Request, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    let courses;
    if (user.role === 'admin' || user.role === 'learner') {
      // Admin & learner see all courses
      courses = await Course.find();
    } else if (user.role === 'instructor') {
      // Instructors see only their own courses
      courses = await Course.find({ createdBy: user.id });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

export const addCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { title, instructor } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newCourse = new Course({ title, instructor, image: imagePath, createdBy: user.id });
    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully!', course: newCourse });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (user.role === 'instructor' && course.createdBy.toString() !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const lessons = await Lesson.find({ courseId: course._id });
    res.json({ course, lessons });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching course details', error: error.message });
  }
};
