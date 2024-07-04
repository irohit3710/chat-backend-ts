import { model, Schema, Document } from "mongoose";
import userModel, { IUser } from "./user.model";

export interface IToken extends Document {
    userId: Schema.Types.ObjectId | IUser;
    token: string;
    createdAt: Date;
}

const tokenSchema = new Schema<IToken>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModel,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
},{
    versionKey: false,
    timestamps: true,
    collection: "tokens"
});

export default model<IToken>('token', tokenSchema);
