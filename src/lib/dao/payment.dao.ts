import razorPayModel from "../../models/razorPay.model";

export class PaymentDao{
    static async createRazorpayPayment(payload:any){
        return await razorPayModel.create(payload);
    }
}