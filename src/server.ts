import express, { Application, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';

// Load environment variables
config();

// Connect to database
connectDB();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads folder

// Routes
import userRoutes from './routes/userRoutes';
app.use('/api', userRoutes);

// Root route for testing server status
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Start server
const PORT: number = parseInt(process.env.PORT as string, 10) || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
