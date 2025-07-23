import express from 'express';
import { connectDB } from './config/db';
import messageRoutes from './routes/message.routes';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/messages', messageRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Message Microservice running on http://localhost:${PORT}`);
});
