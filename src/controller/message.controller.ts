import express from 'express'
import { MessageDao } from '../lib/dao/message.dao';
import { ChatDao } from '../lib/dao/chat.dao';

export class MessageController {
    static async getAllMessages(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const chatId = req.params.chatId;
            const messages = await MessageDao.getAllMessages(chatId);
            res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    }

    static async sendMessage(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { content, chatId } = req.body;
            if (!content || !chatId) {
                return res.sendStatus(400);
            }
            var newMessage = {
                sender: req.user._id,
                content: content,
                chat: chatId,
            };
            const message = await MessageDao.addMessage(newMessage);
            if(!message){
                return res.status(404).send("Something went wrong");
            }
            
            const chatLatestMessage  = await ChatDao.updateChatLatestMessage(chatId, message._id);
            if(!chatLatestMessage){
                return res.status(404).send("Something went wrong");
            }
            res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    }
}