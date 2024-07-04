import { model, Schema, Document } from "mongoose";
import messageModel, { IMessage } from "./message.model";
import userModel, { IUser } from "./user.model";

export interface IChat extends Document {
	chatName: string,
	isGroupChat:boolean,
	users: Schema.Types.ObjectId[],
	latestMessage: Schema.Types.ObjectId,
	groupAdmin: Schema.Types.ObjectId,
	otherAdmins: Schema.Types.ObjectId[],
}

const chatSchema = new Schema<IChat>({
	chatName:{type: String, required: true},
	isGroupChat:{type: Boolean, default: false},
	users:[{type: Schema.Types.ObjectId, ref: userModel}],
	latestMessage:{type: Schema.Types.ObjectId, ref: messageModel},
	groupAdmin:{type: Schema.Types.ObjectId, ref: userModel},
	otherAdmins:[{type: Schema.Types.ObjectId, ref: userModel}],
}, {
	versionKey: false,
	timestamps: true,
	collection: "chats"
}
);

export default model<IChat>('chats', chatSchema);
