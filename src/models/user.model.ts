import { model, Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    pic: string;
    isAdmin: boolean;
    private: boolean;
    suspended: boolean;
    warnings: number;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    private: {
      type: Boolean,
      required: true,
      default: false,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    warnings: {
      type: Number,
      default: 0,
    }
  },{
    versionKey: false,
    timestamps: true,
    collection: "users"
}
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default model<IUser>('users', userSchema);
