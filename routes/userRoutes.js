const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerUser, loginUser } = require('../controllers/controller');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// ✅ Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists in your project root
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ User Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Get All Courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// ✅ Add a New Course (With Image Upload)
router.post('/courses/add', upload.single('image'), async (req, res) => {
  try {
    const { title, instructor } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    
    const newCourse = new Course({ title, instructor, image: imagePath });
    await newCourse.save();
    
    res.status(201).json({ message: "Course added successfully!", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error: error.message });
  }
});

// ✅ Get Course by ID (Including Lessons)
// ✅ Get Course by ID (Including Lessons)
router.get('/courses/:courseId', async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // ✅ Fix: Fetch lessons using `courseId`
      const lessons = await Lesson.find({ courseId: course._id }); 
      res.json({ course, lessons });
    } catch (error) {
      console.error("Error fetching course details:", error);
      res.status(500).json({ message: "Error fetching course details" });
    }
  });
  

// ✅ Add a Lesson to a Course
router.post('/courses/:id/lessons', async (req, res) => {
    try {
      const { title, content, videoUrl } = req.body; // ✅ Include videoUrl
      const courseId = req.params.id;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      const newLesson = new Lesson({ title, content, videoUrl, courseId }); // ✅ Save videoUrl
      console.log(newLesson)
      await newLesson.save();
  
      res.status(201).json({ message: "Lesson added successfully!", lesson: newLesson });
    } catch (error) {
      res.status(500).json({ message: "Error adding lesson", error: error.message });
    }
  });
  
  

module.exports = router;
