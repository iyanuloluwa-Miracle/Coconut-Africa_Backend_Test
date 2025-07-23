import { Message } from '../models/message.model'; // Reuse shared model

export async function processMessageJob(messageId: string) {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new Error(`Message with ID ${messageId} not found`);
  }

  // Simulate sending the message
  console.log(`📤 Sending message to ${message.email}: ${message.message}`);
}
