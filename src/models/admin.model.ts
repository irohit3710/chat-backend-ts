import { model, Schema, Document } from "mongoose";

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
}

const adminSchema = new Schema<IAdmin>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {
    versionKey: false,
    timestamps: true,
    collection: "admin"
});

export default model<IAdmin>('admin', adminSchema);
