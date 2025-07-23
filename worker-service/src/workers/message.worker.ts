import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import { Message } from '../models/message.model';

async function startWorker() {
  try {
    await mongoose.connect('mongodb://localhost:27017/email-system');
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
          host: 'localhost',
          port: 6379,
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
