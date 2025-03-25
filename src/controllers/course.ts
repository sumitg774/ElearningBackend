// src/controllers/courseController.ts
import { Request, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

export const addCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, instructor } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newCourse = new Course({ title, instructor, image: imagePath });
    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully!', course: newCourse });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Fetch lessons for this course
    const lessons = await Lesson.find({ courseId: course._id });
    res.json({ course, lessons });
  } catch (error: any) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Error fetching course details', error: error.message });
  }
};
