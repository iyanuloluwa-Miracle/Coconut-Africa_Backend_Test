import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Import dotenv

// Load environment variables from .env file
dotenv.config();

export async function connectDB() {
  try {
    // Use process.env for MongoDB URI
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/email-system');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}