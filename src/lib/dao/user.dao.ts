import tokenModel from "../../models/token.model";
import userModel from "../../models/user.model";

export class UserDao{
    static async createUser(payload:any){
        return await userModel.create(payload);
    }
    
    static async getUserById(id:any){
        return await userModel.findById(id);
    }

    static async getUserByEmail(email:any){
        return await userModel.findOne({email: email});
    }

    static async getAllUsersCount(){
        return await userModel.find().countDocuments();
    }

    static async getAllUsersWithAdminQuery(query:any, skip:any, count:any){
        return await userModel.find(query).skip(skip).limit(count).select('name email isAdmin');
    }

    static async suspendUserAccount(id:any){
        return await userModel.findByIdAndUpdate(id,{
            $set: {suspended: true},
        },{new: true})
    }

    static async getTokenByUserId(userId:any){
        return await tokenModel.findOne({userId: userId}).lean();
    }
    
    static async getTokenByUserIdAndToken(userId:any,token:any){
        return await tokenModel.findOne({userId: userId,token: token});
    }

    static async updateUserPassword(userId:any,pass:any){
        return await userModel.findByIdAndUpdate(userId,{
            $set:{password: pass},
        },{new: true});
    }

    static async deleteExistingToken(userId:any,token:any){
        return await tokenModel.findOneAndDelete({userId: userId, token:token});
    }

    static async getAllMatchingUsers(query:any, userId:any){
        return userModel.find(query).find({_id:{$ne: userId}});
    }

    static async makeProfilePrivate(userId:any, privateStatus:any){
        return userModel.findByIdAndUpdate(userId,{
            $set:{private: privateStatus},
        },{new: true});
    }
}