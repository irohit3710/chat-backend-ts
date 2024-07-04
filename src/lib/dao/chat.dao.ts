import chatModel from "../../models/chat.model";
import userModel from "../../models/user.model";

export class ChatDao{
    static async getAllChats(){
        return await chatModel.find();
    } 
    
    static async getAllGroupsWithQuery(query:any, skip:any, count:any){
        return await chatModel.find(query).skip(skip).limit(count).select('chatName users groupAdmin').populate({
            path: 'groupAdmin',
            select: 'name email'
        }).populate({
            path: 'users',
            select: 'name email'
        });
    }

    
    static async getAllGroupsCount(){
        return await chatModel.find({isGroupChat: true}).countDocuments();
    }

    static async createChat(data:any){
        return await chatModel.create(data);
    }

    static async getFullChat(id:any){
        return await chatModel.findOne({_id: id}).populate({
            path:'users',
            select:'-password'
        });
    }

    static async getUserChats(query:any){
        return await chatModel.find(query).populate({
            path:'users',
            select:'-password',
        }).populate({
            path:'latestMessage',
        }).populate({
            path:'latestMessage.sender',
            select:'name pic email',
        })
    }

    static async fetchUserChats(query:any){
        return await chatModel.find(query).populate({
            path:'users',
            select:'-password',
        }).populate({
            path:'groupAdmin',
            select:'-password'
        }).populate({
            path:'latestMessage',
        }).then(async (results:any) => {
            results = await userModel.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            return results;
        })
    }

    static async getGroupChat(id:any){
        return await chatModel.find({_id: id}).populate({
            path:'users',
            select:'-password',
        }).populate({
            path:'groupAdmin',
            select:'-password'
        })
    }

    static async renameGroupChat(id:any,name:any){
        return await chatModel.findByIdAndUpdate(id,{
            $set:{chatName: name},
        },{new: true}).populate({
            path:'users',
            select:'-password',
        }).populate({
            path:'groupAdmin',
            select:'-password',
        });
    }

    static async removeFromGroup(id:any,userId:any){
        return await chatModel.findByIdAndUpdate(id,{
            $pull: {users: userId}
        },{new: true}).populate({
            path:'users',
            select:'-password',
        }).populate({
            path:'groupAdmin',
            select:'-password',
        });
    }

    static async addToGroup(id:any,userId:any){
        return await chatModel.findByIdAndUpdate(id,{
            $push: {users: userId}
        },{new: true}).populate({
            path:'users',
            select:'-password',
        }).populate({
            path:'groupAdmin',
            select:'-password',
        });
    }


    static async updateChatLatestMessage(chatId:any, message:any){
        return await chatModel.findByIdAndUpdate(chatId,{
            $set: {latestMessage: message},
        },{new: true});
    }
    

    
}