import adminModel from "../../models/admin.model";

export class AdminDao{
    static async createAdmin(payload:any){
        return await adminModel.create(payload);
    }

    static async getAdminByEmail(email:any){
        return await adminModel.findOne({email: email});
    }

    static async getAdminById(id:any){
        return await adminModel.findById(id,'-password');
    }
    
}