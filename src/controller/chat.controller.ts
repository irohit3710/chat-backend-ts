import express from 'express'
import { ChatDao } from '../lib/dao/chat.dao';

export class ChatController {

    static async accessChat(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { userId } = req.body;

        if (!userId) {
            return res.sendStatus(400);
        }

        // Create the query object
        let query = {
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        };

        var isChat = await ChatDao.getUserChats(query);

        if (isChat.length > 0) {
            res.status(200).send(isChat[0]);
        }
        else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            const createdChat = await ChatDao.createChat(chatData);
            const FullChat = await ChatDao.getFullChat(createdChat._id);
            res.status(200).json(FullChat);
        }
    }

    static async fetchChats(req: express.Request, res: express.Response, next: express.NextFunction) {
        const query = {
            users: { $elemMatch: { $eq: req.user._id } }
        }

        const results = await ChatDao.fetchUserChats(query);
        res.status(200).send(results);
    }

    static async createGroupChat(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please Fill all the feilds" });
        }

        var users = JSON.parse(req.body.users);

        if (users.length < 2) {
            return res
                .status(400)
                .send("More than 2 users are required to form a group chat");
        }

        users.push(req.user);

        const groupChatPayload = {
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        }

        const groupChat = await ChatDao.createChat(groupChatPayload);
        if (!groupChat) {
            res.status(404).send('Chat not created');
        }

        const fullGroupChat = await ChatDao.getGroupChat(groupChat._id);
        res.status(200).json(fullGroupChat);
    }

    static async renameGroupChat(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { chatId, chatName } = req.body;
            
            const updatedChat  = await ChatDao.renameGroupChat(chatId, chatName);
            if(!updatedChat){
                return res.status(404).send('Chat not found');
            }
            res.status(200).json(updatedChat);
        } catch (error) {
            next(error);
        }
    }

    static async removeFromGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { chatId, userId } = req.body;
            
            const removed  = await ChatDao.removeFromGroup(chatId, userId);
            if(!removed){
                return res.status(404).send('Chat not found');
            }
            res.status(200).json(removed);
        } catch (error) {
            next(error);
        }
    }

    static async addToGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { chatId, userId } = req.body;
            
            const added  = await ChatDao.addToGroup(chatId, userId);
            if(!added){
                return res.status(404).send('Chat not found');
            }
            res.status(200).json(added);
        } catch (error) {
            next(error);
        }
    }

    static async f(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }
}