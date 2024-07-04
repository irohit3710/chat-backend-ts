import { model, Schema, Document } from "mongoose";
import userModel, { IUser } from "./user.model";

export const razorpayStatusEnum = {
    PENDING: 'Pending',
    FAILURE: 'Failure',
    SUCCESS: 'Success',
} as const;

export interface IRazorPay extends Document {
    userId: Schema.Types.ObjectId | IUser;
    orderId: string;
    amount: string;
    orderFor: string;
    paymentId: string;
    signature: string;
    status: typeof razorpayStatusEnum[keyof typeof razorpayStatusEnum];
}

const razorPaySchema = new Schema<IRazorPay>(
  {
    userId: { type: Schema.Types.ObjectId, ref: userModel },
    orderId: { type: String },
    amount: { type: String },
    orderFor: { type: String, default: 'Premium of ChitChatWeb' },
    paymentId: { type: String, required: true },
    signature: { type: String, required: true },
    status: { type: String, enum: Object.values(razorpayStatusEnum) },
  },{
    versionKey: false,
    timestamps: true,
    collection: "razorpays"
}
);

export default model<IRazorPay>('razorpays', razorPaySchema);
