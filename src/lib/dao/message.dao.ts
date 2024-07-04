import messageModel from "../../models/message.model";

export class MessageDao{
    static async getAllMessages(chatId:any){
        return await messageModel.find({chat: chatId}).populate({
            path:'sender',
            select:'name email',
        }).populate({
            path:'chat',
        })
    }

    static async addMessage(payload:any){
        const newMessage =  await messageModel.create(payload);
        // Populate sender field
        await newMessage.populate({
            path: 'sender',
            select: 'name',
        });

        // Populate chat.users field
        await newMessage.populate({
            path: 'chat.users',
            select: 'name email',
        });

        // Populate chat field
        await newMessage.populate('chat');

        return newMessage;
    }
}