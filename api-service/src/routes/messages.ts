import express from 'express';
import { z } from 'zod';
import { Message } from '../model/message';
import { addToQueue } from '../queue/messageQueue';

const router = express.Router();

const messageSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1)
});

router.post('/', async (req, res) => {
  try {
    const parsedData = messageSchema.parse(req.body);
    
    const message = new Message({
      email: parsedData.email,
      message: parsedData.message
    });

    await message.save();
    await addToQueue(message._id.toString());

    res.status(201).json({ message: 'Message saved and queued', id: message._id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().select('-__v');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;