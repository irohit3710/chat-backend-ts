import { model, Schema, Document } from "mongoose";
import userModel, { IUser } from "./user.model";

export interface ILocation extends Document {
    user: Schema.Types.ObjectId | IUser;
    coordinates: {
        type: string;
        coordinates: number[];
    };
}

const locationSchema = new Schema<ILocation>(
    {
        user: { type: Schema.Types.ObjectId, ref: userModel },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },{
        versionKey: false,
        timestamps: true,
        collection: "locations"
    }
);

locationSchema.index({ coordinates: '2dsphere' });

export default model<ILocation>('locations', locationSchema);
