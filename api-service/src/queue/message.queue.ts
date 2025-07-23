import { Queue } from 'bullmq';
import dotenv from 'dotenv'; // Import dotenv


dotenv.config();

export const messageQueue = new Queue('message-queue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10), // Parse port to number
  },
});

export async function addToQueue(messageId: string) {
  await messageQueue.add(
    'process-message',
    { messageId },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    }
  );
}