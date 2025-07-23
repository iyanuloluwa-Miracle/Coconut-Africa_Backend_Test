import { Queue } from 'bullmq';

export const messageQueue = new Queue('message-queue', {
  connection: {
    host: 'localhost',
    port: 6379,
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
