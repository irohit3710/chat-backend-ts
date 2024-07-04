import reportModel from "../../models/report.model";

export class ReportDao{
    static async getAllReports(){
        return await reportModel.find().populate({
            path:'userId',
            select:'name email'
        }).populate({
            path:'by',
            select:'name email',
        });
    }
}