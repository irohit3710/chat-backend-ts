import express from 'express'
import { Utility } from '../util/util';
import jwt from 'jsonwebtoken'
import { CONFIG } from '../config/environment';
import { UserDao } from '../lib/dao/user.dao';
import { AdminDao } from '../lib/dao/admin.dao';

export class AuthMiddleware {
    static async userAuthMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];

                //decodes token id
                const decoded: any = jwt.verify(token, CONFIG.jwt.secret);
                const user = await UserDao.getUserById(decoded.id);
                if (!user) {
                    return res.status(404).send("Unauthorised user");
                }
                req.user = user;
                next();
            }
            else {
                res.status(401);
                throw new Error("Not authorized, no token")
            }
        } catch (error) {
            res.status(400).send("Unauthorised user")
        }
    }


    static async adminAuthMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(400).send("Unauthorised user");
            }

            //decodes token id
            const decoded: any = jwt.verify(token, CONFIG.jwt.secret);

            const admin = await AdminDao.getAdminById(decoded.userID);
            if (!admin) {
                return res.status(400).send("Unauthorised user");
              }
              req.admin = admin;

        } catch (error) {
            res.status(400).send("Unauthorised user")
        }
    }
}