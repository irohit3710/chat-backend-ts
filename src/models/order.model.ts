import { model, Schema, Document } from "mongoose";
import userModel, { IUser } from "./user.model";

export interface IOrder extends Document {
    userId: Schema.Types.ObjectId | IUser;
    orderId: string;
    amount: string;
    orderFor: string;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: userModel },
    orderId: { type: String },
    amount: { type: String },
    orderFor: { type: String, default: 'Premium of ChitChatWeb' },
  },{
    versionKey: false,
    timestamps: true,
    collection: "orders"
}
);

export default model<IOrder>('orders', orderSchema);
