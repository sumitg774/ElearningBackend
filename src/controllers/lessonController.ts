// src/controllers/lessonController.ts
import { Request, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';

export const addLessonToCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { title, content, videoUrl } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (user.role === 'instructor' && course.createdBy.toString() !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newLesson = new Lesson({ title, content, videoUrl, courseId });
    await newLesson.save();

    res.status(201).json({ message: 'Lesson added successfully!', lesson: newLesson });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding lesson', error: error.message });
  }
};
