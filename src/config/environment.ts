import * as dotenv from "dotenv";
dotenv.config();
import path from "path";

export const CONFIG = {
  DB_CONNECTION_STRING: process.env.DB_STRING,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS
    ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
    : 10,
  jwt: {
    // secret: "SDKFJ9#R3IO90U3@#9DSFIN",
    secret: "RohitPanwar",
    refresh_token_secret: "RohitPanwar",
    options: {
      expiresIn: "1d",
    },
    cookie: {
      httpOnly: true,
      sameSite: true,
      signed: true,
      secure: true,
    },
  },
  uploadsFolderPath: path.resolve(__dirname, "../../uploads"),
};
