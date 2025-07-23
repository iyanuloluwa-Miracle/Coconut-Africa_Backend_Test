import { Message, IMessage } from '../model/message.model';
import { addToQueue } from '../queue/message.queue';

export async function createMessageService(email: string, message: string): Promise<IMessage> {
  const newMessage = new Message({ email, message });
  await newMessage.save();
  await addToQueue(newMessage._id.toString());
  return newMessage;
}

export async function getAllMessagesService() {
  return await Message.find().select('-__v');
}
