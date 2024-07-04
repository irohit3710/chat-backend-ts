import orderModel from "../../models/order.model";

export class OrderDao{
    static async createOrder(payload:any){
        return await orderModel.create(payload);
    }
}