import { model, Schema, Document } from "mongoose";
import userModel, { IUser } from "./user.model";

export interface IBlock extends Document {
    userId: Schema.Types.ObjectId | IUser;
    by: Schema.Types.ObjectId | IUser;
    time: Date;
}

const blockSchema = new Schema<IBlock>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModel,
    },
    by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModel,
    },
    time: {
        type: Date,
        default: new Date(),
    }
}, {
    versionKey: false,
    timestamps: true,
    collection: "block"
});

export default model<IBlock>('block', blockSchema);
