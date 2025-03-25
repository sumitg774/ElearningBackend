// src/server.ts
import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import path from 'path';

// Load environment variables from .env
config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads folder

// Routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
