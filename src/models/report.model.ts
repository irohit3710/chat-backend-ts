import { model, Schema, Document } from "mongoose";
import userModel, { IUser } from "./user.model";

export interface IReport extends Document {
    userId: Schema.Types.ObjectId | IUser;
    by: Schema.Types.ObjectId | IUser;
    time: Date;
    count: number;
}

const reportSchema = new Schema<IReport>({
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
    },
    count: {
        type: Number,
        default: 0,
    }
},{
    versionKey: false,
    timestamps: true,
    collection: "reports"
});

export default model<IReport>('reports', reportSchema);
