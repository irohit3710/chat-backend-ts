import { model, Schema, Document } from "mongoose";
import userModel, { IUser } from "./user.model";
import chatModel, { IChat } from "./chat.model";

export interface IMessage extends Document {
    sender: Schema.Types.ObjectId;
    content: string;
    chat: Schema.Types.ObjectId;
    readBy: Schema.Types.ObjectId[];
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: userModel },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'chats'},
    readBy: [{ type: Schema.Types.ObjectId, ref: userModel }],
  },{
    versionKey: false,
    timestamps: true,
    collection: "messages"
}
);

export default model<IMessage>('messages', messageSchema);
