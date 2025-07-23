import { connectDB } from './config/db';
import { startMessageWorker } from './workers/message.worker';

async function bootstrap() {
  try {
    await connectDB();
    startMessageWorker();
  } catch (err) {
    console.error('❌ Worker startup error:', err);
    process.exit(1);
  }
}

bootstrap();
