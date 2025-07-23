import { Request, Response } from 'express';
import { z } from 'zod';
import { createMessageService, getAllMessagesService } from '../services/message.service';

const messageSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
});

export async function createMessage(req: Request, res: Response) {
  try {
    const { email, message } = messageSchema.parse(req.body);
    const createdMessage = await createMessageService(email, message);
    res.status(201).json({ message: 'Message saved and queued', id: createdMessage._id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const messages = await getAllMessagesService();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
