
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors'; // Assuming you installed this

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import requestRoutes from './routes/requestRoutes.js'; 

dotenv.config();

connectDB();

const app = express();

// --- CORS Configuration FIX ---
app.use(cors({
    // Allow requests from your frontend development server
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple welcome route
app.get('/', (req, res) => {
    res.send('Blood Bank API is running...');
});

// Use Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/donors', donorRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/requests', requestRoutes); 

// Error Middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Using port 5004 to resolve port conflict
const PORT = 5004;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);