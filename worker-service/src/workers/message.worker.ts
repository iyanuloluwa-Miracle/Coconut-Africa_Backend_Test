import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import { processMessageJob } from '../jobs/message.processor';

dotenv.config();

export function startMessageWorker() {
  const worker = new Worker(
    'message-queue',
    async (job) => {
      const { messageId } = job.data;
      await processMessageJob(messageId);
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
}
