import bcrypt from "bcrypt";
import { CONFIG } from "../config/environment";
import jwt from "jsonwebtoken";
import path from "path";
import crypto from "crypto";

export class Utility {
    static comparePasswordHash(hash: string, plainText: string) {
        return bcrypt.compareSync(plainText, hash);
    }

    static createPasswordHash(password: string) {
        let salt = bcrypt.genSaltSync(CONFIG.BCRYPT_SALT_ROUNDS);
        return bcrypt.hashSync(password, salt);
    }

    // Generate JWT token
    static generateJwtToken(userUUID: string) {
        return jwt.sign(
            {
                id: userUUID,
            },
            CONFIG.jwt.secret,
            { expiresIn: "40d" }
        );
    }

    static generateRefreshToken(userUUID: string) {
        return jwt.sign({
            id: userUUID,
        },
            CONFIG.jwt.refresh_token_secret);
    }

    static refreshToken(refreshToken: string) {
        return jwt.verify(refreshToken, CONFIG.jwt.refresh_token_secret, (err: any, user: any) => {
            if (err) return false;
            const accessToken = this.generateJwtToken(user.id);
            if (!accessToken) {
                return false;
            }
            return accessToken;
        });
    }

    static decipherData(encryptedData: string, key: any) {

        const splitData = encryptedData.split(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, splitData[0]);

        let decryptedData = decipher.update(splitData[1], "hex", "utf-8");

        decryptedData += decipher.final("utf8");

        return decryptedData;
    }

    static generateRandomPassword() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result
    }

    static generateOrderId() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result
    }

    static removeEmpty(obj: any) {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
    }

}
