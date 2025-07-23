import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import { Message } from '../models/message.model';
import dotenv from 'dotenv';


dotenv.config();

async function startWorker() {
  try {
    // Use process.env for MongoDB URI
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/email-system');
    console.log('✅ Worker connected to MongoDB');

    const worker = new Worker(
      'message-queue',
      async (job) => {
        const { messageId } = job.data;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            throw new Error(`Message with ID ${messageId} not found`);
          }

          // Simulate sending message
          console.log(`📤 Sending message to ${message.email}: ${message.message}`);
        } catch (error) {
          console.error('❌ Error processing job:', error);
          throw error;
        }
      },
      {
        connection: {
         
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10), 
        },
      }
    );

    worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });

  } catch (err) {
    console.error('❌ Worker startup error:', err);
    process.exit(1);
  }
}

startWorker();