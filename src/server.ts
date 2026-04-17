import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database';
import fileLoggerMiddleware from './middleware/fileLogger';
import errorHandler from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';
import cardRoutes from './routes/cardRoutes';
import postRoutes from './routes/postRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(morgan(process.env.LOG_FORMAT || 'dev'));
app.use(fileLoggerMiddleware);
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/posts', postRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
