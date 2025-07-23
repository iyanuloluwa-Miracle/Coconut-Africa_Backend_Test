import { Queue } from 'bullmq';

const queue = new Queue('message-queue', {
  connection: {
    host: 'localhost', // Changed from 'redis' to 'localhost'
    port: 6379
  }
});

export async function addToQueue(messageId: string) {
  await queue.add('process-message', { messageId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });
}